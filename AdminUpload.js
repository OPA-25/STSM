import React, { useState } from "react";
import Navbar from "./Navbar"; // ✅ Import the Navbar component

function AdminUpload() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("Uploading...");
    try {
      const form = new FormData();
      form.append("name", name);
      form.append("location", location);
      form.append("category", category);
      form.append("description", description);
      if (latitude) form.append("latitude", latitude);
      if (longitude) form.append("longitude", longitude);
      if (image) form.append("image", image);

      const res = await fetch("http://localhost:9090/api/destinations", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setStatus("Uploaded successfully");

      // clear form
      setName("");
      setLocation("");
      setCategory("");
      setDescription("");
      setLatitude("");
      setLongitude("");
      setImage(null);
      console.log("Saved:", data);
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
    }
  }

  return (
    <>
      {/* ✅ Navbar at the top */}
      <Navbar />

      <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 16px" }}>
        <h2 style={{ color: "#004aad" }}>Admin — Upload Destination</h2>
        <form
          onSubmit={onSubmit}
          style={{ marginTop: 16, display: "grid", gap: 12 }}
        >
          <input
            required
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Category (e.g., Beach, Hill Station)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder="Short description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ ...inputStyle, minHeight: 100 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
            <input
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              style={{ ...inputStyle, flex: 1 }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                background: "#004aad",
                color: "#fff",
                border: "none",
                borderRadius: 8,
              }}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => {
                setName("");
                setLocation("");
                setCategory("");
                setDescription("");
                setLatitude("");
                setLongitude("");
                setImage(null);
                setStatus("");
              }}
              style={{
                padding: "10px 16px",
                background: "#f3f4f6",
                border: "none",
                borderRadius: 8,
              }}
            >
              Reset
            </button>
          </div>
        </form>
        {status && <div style={{ marginTop: 12 }}>{status}</div>}
      </div>
    </>
  );
}

const inputStyle = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  width: "100%",
  boxSizing: "border-box",
};

export default AdminUpload;
