// import React, { useState } from "react";
// import Navbar from "./Navbar";
// import { useNavigate } from "react-router-dom";
// import "./Register.css"; // Reuse the same CSS file

// export default function Login() {
//   const [usernameOrEmail, setUsernameOrEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     const res = await fetch("http://localhost:9090/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ usernameOrEmail, password }),
//     });

//     const data = await res.json();
//     setMsg(data.message);

//     if (data.message === "Login Successful") {
//       // ✅ Store login token/flag in localStorage
//       localStorage.setItem("token", "loggedin");

//       // Redirect to home page
//       navigate("/");
//     }
//   };

//   return (
//     <div>
//       <Navbar />

//       <div className="register-container">
//         <div className="register-card">
//           <h2 className="title">Login</h2>

//           <form onSubmit={handleLogin}>
//             <input
//               className="input-box"
//               placeholder="Username or Email"
//               value={usernameOrEmail}
//               onChange={(e) => setUsernameOrEmail(e.target.value)}
//             />

//             <input
//               className="input-box"
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <button className="main-btn">Login</button>
//           </form>

//           {msg && <p className="msg">{msg}</p>}

//           <button
//             className="link-btn"
//             onClick={() => navigate("/register")}
//           >
//             Create New Account
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:9090/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password }),
    });

    const data = await res.json();
    setMsg(data.message);

    if (data.message === "Login Successful") {
      localStorage.setItem("token", "loggedin");
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);
      localStorage.setItem("email", data.email);

      navigate("/");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="register-container">
        <div className="register-card">
          <h2 className="title">Login</h2>

          <form onSubmit={handleLogin}>
            <input
              className="input-box"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
            />

            <input
              className="input-box"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className="main-btn">Login</button>
          </form>

          {msg && <p className="msg">{msg}</p>}

          <button className="link-btn" onClick={() => navigate("/register")}>
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
}
