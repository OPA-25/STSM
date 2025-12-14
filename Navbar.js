// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Navbar.css";

// function Navbar() {
//   const navigate = useNavigate();
//   const isLoggedIn = localStorage.getItem("token"); // Check login

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Remove token
//     navigate("/login");               // Redirect to login
//   };

//   return (
//     <nav className="navbar">
//       {/* Logo Section */}
//       <div className="navbar-logo">
//         <div className="navbar-logo-circle">ST</div>
//         <span className="navbar-title">Smart Tourist Safety</span>
//       </div>

//       {/* Navigation Links */}
//       <ul className="navbar-links">
//         <li><Link to="/">Home</Link></li>

//         {/* Show these only if logged in */}
//         {isLoggedIn && (
//           <>
//             <li><Link to="/explore">Explore</Link></li>
//             <li><Link to="/mapview">Map View</Link></li>
//             <li><Link to="/alertform">AlertForm</Link></li>
//             <li><Link to="/alertmsg">Alert</Link></li>
//             <li><Link to="/communityposts">Community Post</Link></li>
//           </>
//         )}

//         {/* Show Login/Register only if NOT logged in */}
//         {!isLoggedIn && (
//           <>
//             <li><Link to="/login">Login</Link></li>
//             <li><Link to="/register">Register</Link></li>
//           </>
//         )}
//       </ul>

//       {/* Action Buttons */}
//       <div className="navbar-actions">
//         <button className="btn-help">Get Help</button>

//   {/* Logout button visible only when logged in */}
//         {isLoggedIn && (
//           <button className="btn-logout" onClick={handleLogout}>
//             Logout
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;



import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="navbar-logo-circle">ST</div>
        <span className="navbar-title">Smart Tourist Safety</span>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>

        {isLoggedIn && (
          <>
            <li><Link to="/explore">Explore</Link></li>
            <li><Link to="/mapview">Map View</Link></li>
            {/* <li><Link to="/alertform">AlertForm</Link></li> */}
            {/* <li><Link to="/alertmsg">Alert</Link></li> */}
            <li className="relative">
  <Link to="/alertmsg" className="navbar-link">
    Alert
  </Link>
  <span className="alert-dot"></span>
</li>

            <li><Link to="/communityposts">Community Post</Link></li>
          </>
        )}

        {/* ADMIN ONLY */}
        {isLoggedIn && role === "ADMIN" && (
          <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
        )}
 
        {!isLoggedIn && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )} 
      </ul>

      <div className="navbar-actions">
        <button className="btn-help">Get Help</button>

        {isLoggedIn && (
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
