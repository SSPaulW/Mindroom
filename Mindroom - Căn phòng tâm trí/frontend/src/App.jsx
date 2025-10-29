// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Questionnaire from "./pages/Questionnaire";
import Dashboard from "./pages/Dashboard";
import Video from "./pages/Video";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => onAuthStateChanged(auth, u => setUser(u)), []);
  return (
    <BrowserRouter>
      <NavBar user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video" element={<Video />} />
      </Routes>
    </BrowserRouter>
  );
}