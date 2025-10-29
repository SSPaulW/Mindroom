// src/components/NavBar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default function NavBar({ user }) {
  const nav = useNavigate();
  const logout = async () => {
    await signOut(auth);
    nav("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand" to="/">MindRoom</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Trang chủ</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/questionnaire">Daily Check-in</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/video">Video</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/dashboard">Teacher</Link></li>
          </ul>
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="me-2 text-muted small">{user.email}</span>
                <button className="btn btn-outline-primary btn-sm" onClick={logout}>Đăng xuất</button>
              </>
            ) : (
              <>
                <Link className="btn btn-link" to="/login">Đăng nhập</Link>
                <Link className="btn btn-primary ms-2" to="/register">Đăng ký</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}