import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Navbar from "./components/common/Navbar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <>
      <Navbar />
      {children}
    </>
  </ProtectedRoute>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/feed" element={<ProtectedLayout><Home /></ProtectedLayout>} />
        <Route path="/profile/:username" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
        <Route path="/search" element={<ProtectedLayout><Search /></ProtectedLayout>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
