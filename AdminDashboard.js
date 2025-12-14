import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css"; // Optional: create for styling
import Navbar from "./Navbar";

export default function AdminDashboard() {
  return (
    <div>
        <Navbar />
    <div className="admin-dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p>Welcome, Admin! Manage your tourist safety website features from here.</p>

      <div className="dashboard-features">

        {/* Admin Upload Page */}
        <Link to="/admin/upload">
          <div className="dashboard-card">
            <h3>Admin Upload</h3>
            <p>Upload destinations, images, and other website data.</p>
          </div>
        </Link>

        {/* Alert Form Management */}
        <Link to="/alertform">
          <div className="dashboard-card">
            <h3>Alert Form</h3>
            <p>Manage emergency alerts and notifications for tourists.</p>
          </div>
        </Link>

        {/* Placeholder for Community Posts */}
        <Link to="/communityposts">
          <div className="dashboard-card">
            <h3>Community Posts</h3>
            <p>View and manage posts from the tourist community.</p>
          </div>
        </Link>

        {/* Placeholder for Reports / Analytics */}
        <Link to="/admin/reports">
          <div className="dashboard-card">
            <h3>Reports & Analytics</h3>
            <p>View site usage, alerts, and other statistics.</p>
          </div>
        </Link>

        {/* Placeholder for User Management */}
        <Link to="/admin/users">
          <div className="dashboard-card">
            <h3>Manage Users</h3>
            <p>View and manage registered users of the platform.</p>
          </div>
        </Link>

      </div>
    </div>
    </div>
  );
}
