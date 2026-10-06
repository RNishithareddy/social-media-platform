import { useState } from "react";
import "./App.css";

function App() {
  const [post, setPost] = useState("");
  const [posts, setPosts] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  const addPost = async () => {
  if (post.trim() === "") return;

  try {
    const response = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: post,
      }),
    });

    const newPost = await response.json();

    setPosts([newPost, ...posts]);
    setPost("");
  } catch (error) {
    console.error("Error creating post:", error);
  }
};
  const likePost = (id) => {
    setPosts(
      posts.map((item) =>
        item.id === id
          ? { ...item, likes: item.likes + 1 }
          : item
      )
    );
  };

  const sharePost = () => {
    alert("✅ Post shared successfully!");
  };

  const addComment = (id, commentText) => {
    if (commentText.trim() === "") return;

    setPosts(
      posts.map((item) =>
        item.id === id
          ? {
              ...item,
              comments: [...item.comments, commentText],
            }
          : item
      )
    );
  };

  return (
    <div className="app">
      <nav className="navbar">
        <h1>ConnectHub</h1>

        <div className="nav-links">
          <span onClick={() => setShowProfile(false)}>
            Home
          </span>

          <span onClick={() => setShowProfile(true)}>
            Profile
          </span>

          <span>Messages</span>
        </div>
      </nav>

      <main className="container">

        {showProfile ? (

          <section className="profile">
            <h2>My Profile</h2>

            <div className="profile-card">
              <div className="profile-avatar">U</div>

              <h3>User</h3>
              <p>@user</p>

              <div className="profile-stats">

                <div>
                  <strong>{posts.length}</strong>
                  <span>Posts</span>
                </div>

                <div>
                  <strong>
                    {posts.reduce(
                      (total, item) => total + item.likes,
                      0
                    )}
                  </strong>
                  <span>Likes</span>
                </div>

                <div>
                  <strong>
                    {posts.reduce(
                      (total, item) =>
                        total + item.comments.length,
                      0
                    )}
                  </strong>
                  <span>Comments</span>
                </div>

              </div>

              <button onClick={() => setShowProfile(false)}>
                ← Back to Home
              </button>
            </div>
          </section>

        ) : (

          <>
            <section className="create-post">
              <h2>Create Post</h2>

              <textarea
                placeholder="What's on your mind?"
                value={post}
                onChange={(e) => setPost(e.target.value)}
              />

              <button onClick={addPost}>
                Post
              </button>
            </section>

            <section className="feed">
              <h2>News Feed</h2>

              {posts.length === 0 ? (
                <p className="empty">
                  No posts yet. Create your first post!
                </p>
              ) : (
                posts.map((item) => (
                  <div className="post" key={item.id}>

                    <div className="post-header">
                      <div className="avatar">U</div>

                      <div>
                        <h3>User</h3>
                        <small>Just now</small>
                      </div>
                    </div>

                    <p>{item.text}</p>

                    <div className="actions">

                      <button
                        onClick={() => likePost(item.id)}
                      >
                        ❤️ {item.likes}
                      </button>

                      <CommentBox
                        postId={item.id}
                        addComment={addComment}
                      />

                      <button onClick={sharePost}>
                        ↗ Share
                      </button>

                    </div>

                    {item.comments.length > 0 && (
                      <div className="comments">
                        <h4>Comments</h4>

                        {item.comments.map(
                          (comment, index) => (
                            <p key={index}>
                              💬 {comment}
                            </p>
                          )
                        )}
                      </div>
                    )}

                  </div>
                ))
              )}
            </section>
          </>
        )}

      </main>
    </div>
  );
}

function CommentBox({ postId, addComment }) {
  const [comment, setComment] = useState("");
  const [showBox, setShowBox] = useState(false);

  const submitComment = () => {
    addComment(postId, comment);
    setComment("");
  };

  return (
    <div>
      <button onClick={() => setShowBox(!showBox)}>
        💬 Comment
      </button>

      {showBox && (
        <div className="comment-box">

          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button onClick={submitComment}>
            Add Comment
          </button>

        </div>
      )}
    </div>
  );
}

export default App;