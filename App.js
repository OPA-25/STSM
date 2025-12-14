// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Home from "./components/Home";
// import Explore from "./components/Explore";
// import AdminUpload from "./components/AdminUpload";
// import MapView from "./components/MapView";
// import AlertForm from "./components/AlertForm";
// import AlertMsg from "./components/AlertMsg";
// import CommunityPosts from "./components/CommunityPosts";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <Router>
//       <Routes>

//         {/* Public Routes */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* PROTECTED ROUTES */}
//         <Route
//           path="/explore"
//           element={
//             <ProtectedRoute>
//               <Explore />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/admin/upload"
//           element={
//             <ProtectedRoute>
//               <AdminUpload />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/mapview"
//           element={
//             <ProtectedRoute>
//               <MapView />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/alertform"
//           element={
//             <ProtectedRoute>
//               <AlertForm />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/alertmsg"
//           element={
//             <ProtectedRoute>
//               <AlertMsg />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/communityposts"
//           element={
//             <ProtectedRoute>
//               <CommunityPosts />
//             </ProtectedRoute>
//           }
//         />

//       </Routes>
//     </Router>
//   );
// }

// export default App;




import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Explore from "./components/Explore";
import AdminUpload from "./components/AdminUpload";
import MapView from "./components/MapView";
import AlertForm from "./components/AlertForm";
import AlertMsg from "./components/AlertMsg";
import CommunityPosts from "./components/CommunityPosts";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* USER PROTECTED */}
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mapview"
          element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alertform"
          element={
            <ProtectedRoute>
              <AlertForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/alertmsg"
          element={
            <ProtectedRoute>
              <AlertMsg />
            </ProtectedRoute>
          }
        />

        <Route
          path="/communityposts"
          element={
            <ProtectedRoute>
              <CommunityPosts />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ONLY */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        
        <Route
          path="/admin/upload"
          element={
            <AdminRoute>
              <AdminUpload />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
