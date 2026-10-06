const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config({ path: __dirname + "/.env" });
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error:", error);
  });

// Post Schema
const postSchema = new mongoose.Schema({
  text: String,
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [String],
    default: [],
  },
});

const Post = mongoose.model("Post", postSchema);

// Home
app.get("/", (req, res) => {
  res.send("ConnectHub Backend is Running!");
});

// Get all posts
app.get("/api/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ _id: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to get posts" });
  }
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  try {
    const newPost = new Post({
      text: req.body.text,
    });

    const savedPost = await newPost.save();

    res.json(savedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});