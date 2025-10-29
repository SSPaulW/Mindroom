// src/pages/Login.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      if (!cred.user.emailVerified) {
        alert("Vui lòng xác thực email trước khi đăng nhập.");
        return;
      }
      alert("Đăng nhập thành công.");
      nav("/");
    } catch (err) {
      console.error(err);
      alert(err.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="container my-4">
      <div className="card p-4">
        <h3>Đăng nhập</h3>
        <input className="form-control my-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="form-control my-2" placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary" onClick={submit}>Đăng nhập</button>
      </div>
    </div>
  );
}