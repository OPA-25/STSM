import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import "./CommunityPosts.css";   // <-- ADD THIS

const CommunityPosts = () => {

  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [desc, setDesc] = useState("");
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:9090/api/posts");
      const data = Array.isArray(res.data) ? res.data : [];
      setPosts(data);
    } catch (e) {
      console.error("Fetch posts failed:", e);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePost = async () => {
    if (!image && !desc.trim()) return;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", desc);

    try {
      const res = await axios.post("http://localhost:9090/api/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setPosts([res.data, ...posts]);
      setImage(null);
      setDesc("");
      fetchPosts();

    } catch (e) {
      console.error("Post failed:", e);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.post(`http://localhost:9090/api/posts/${postId}/like`);
      setPosts(posts.map(p => p.id === postId ? res.data : p));
    } catch (e) {
      console.error("Like failed:", e);
    }
  };

  const handleCommentChange = (postId, text) => {
    setCommentInputs({ ...commentInputs, [postId]: text });
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentInputs[postId];
    if (!text) return;

    try {
      const res = await axios.post(
        `http://localhost:9090/api/posts/${postId}/comments`,
        { text }
      );
      setPosts(posts.map(p => p.id === postId ? res.data : p));
      setCommentInputs({ ...commentInputs, [postId]: "" });

    } catch (e) {
      console.error("Comment failed:", e);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:9090/api/posts/${postId}`);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete post");
    }
  };

  return (
    <div className="community-container">
      <Navbar/>

      {/* CREATE POST BOX */}
      <div className="create-post-box">
        <h3>Create a Post</h3>

        <label className="upload-box">
          📸 Upload Image
          <input type="file" onChange={handleImageChange} />
        </label>

        <textarea
          placeholder="What's on your mind?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          className="post-textarea"
        />

        <button onClick={handlePost} className="post-btn">
          Post
        </button>
      </div>

      {/* POSTS LIST */}
      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id || Math.random()} className="post-card">

            {post.imageBase64 || post.image ? (
              <img
                src={`data:image/jpeg;base64,${post.imageBase64 || post.image}`}
                className="post-image"
                alt="post"
              />
            ) : null}

            <p className="post-desc">{post.description}</p>

            {/* LIKE + DELETE BUTTONS */}
            <div className="post-actions">

              <button className="like-btn" onClick={() => handleLike(post.id)}>
                ❤️ {post.likesCount || 0}
              </button>

              <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                🗑 Delete
              </button>

            </div>

            {/* COMMENT SECTION */}
            <div className="comment-section">
              <input
                placeholder="Write a comment..."
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                className="comment-input"
              />

              <button onClick={() => handleCommentSubmit(post.id)} className="comment-btn">
                💬 Comment
              </button>

              <div className="comment-list">
                {(post.comments || []).map(c => (
                  <div key={c.id || Math.random()} className="single-comment">
                    <b>{c.user || "User"}</b>: {c.text}
                  </div>
                ))}
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default CommunityPosts;
