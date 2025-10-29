// src/pages/Register.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      // create user profile doc
      await setDoc(doc(db, "users", cred.user.uid), { email, role: "student", createdAt: Date.now() });
      alert("Đăng ký thành công. Vui lòng kiểm tra email để xác nhận.");
      nav("/login");
    } catch (err) {
      console.error(err);
      alert(err.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="container my-4">
      <div className="card p-4">
        <h3>Đăng ký</h3>
        <input className="form-control my-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="form-control my-2" placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-primary" onClick={submit}>Đăng ký</button>
      </div>
    </div>
  );
}