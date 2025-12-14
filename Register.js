// import React, { useState } from "react";
// import Navbar from "./Navbar";
// import { useNavigate } from "react-router-dom";
// import "./Register.css"; // Reuse CSS

// export default function Register() {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [msg, setMsg] = useState("");

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const res = await fetch("http://localhost:9090/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ username, email, password }),
//     });

//     const data = await res.json();
//     setMsg(data.message);

//     // ✅ If registration successful, redirect to login
//     if (data.message === "User Registered Successfully") {
//       navigate("/login");
//     }
//   };

//   return (
//     <div>
//       <Navbar />

//       <div className="register-container">
//         <div className="register-card">
//           <h2 className="title">Create Account</h2>

//           <form onSubmit={handleSubmit}>
//             <input
//               className="input-box"
//               placeholder="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />

//             <input
//               className="input-box"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             <input
//               className="input-box"
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <button className="main-btn">Register</button>
//           </form>

//           {msg && <p className="msg">{msg}</p>}

//           <button
//             className="link-btn"
//             onClick={() => navigate("/login")}
//           >
//             Already have an account? Login
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

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:9090/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    setMsg(data.message);

    if (data.message === "Registered Successfully") {
      navigate("/login");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="register-container">
        <div className="register-card">
          <h2 className="title">Create Account</h2>

          <form onSubmit={handleSubmit}>
            <input
              className="input-box"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              className="input-box"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

            <button className="main-btn">Register</button>
          </form>

          {msg && <p className="msg">{msg}</p>}

          <button className="link-btn" onClick={() => navigate("/login")}>
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}
