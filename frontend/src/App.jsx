import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CreateNotes from "./pages/CreateNotes";
import MyProfile from "./pages/MyProfile";
import ListNotes from "./pages/ListNotes";
import Order from "./pages/Order"; // Import the Order component
import Login from "./pages/login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/protectedRoute";
import Navbar from "./components/Navbar"; // Import the Navbar
import './styles/App.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Default styles
import './styles/CustomToastify.css';
function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  
  return (
    <BrowserRouter>
      <Navbar /> {/* Add Navbar here */}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/notes" element={<ProtectedRoute><ListNotes /></ProtectedRoute>} />
        <Route path="/myprofile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        <Route path="/createnotes" element={<ProtectedRoute><CreateNotes /></ProtectedRoute>} />
        <Route path="/notes/:noteId/orders/" element={<ProtectedRoute><Order /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      <ToastContainer /> {/* Place ToastContainer here */}
    </BrowserRouter>
  );
}

export default App;
