// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { auth, db, ts } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { analyzeText } from "../api";
import AnalyzeResult from "../components/AnalyzeResult";

export default function Home() {
  const [user, setUser] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [anonymous, setAnonymous] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  const doAnalyze = async () => {
    if (!text) return alert("Nhập văn bản để phân tích.");
    const res = await analyzeText(text);
    setResult(res);
  };

  const doSave = async () => {
    if (!text) return alert("Nhập văn bản trước khi lưu.");
    if (!user) return alert("Bạn cần đăng nhập để lưu (hoặc chọn lưu ẩn danh).");
    // Run analysis
    const res = result || await analyzeText(text);
    try {
      const doc = {
        uid: anonymous ? null : user?.uid,
        email: anonymous ? null : user?.email,
        text,
        label: res.label,
        scores: res.scores || {},
        anonymous,
        createdAt: serverTimestamp()
      };
      await addDoc(collection(db, "entries"), doc);
      // if severe label, also write alert document
      if (["buồn","chán nản","lo âu"].includes(res.label)) {
        await addDoc(collection(db, "alerts"), { entryRef: doc, label: res.label, createdAt: serverTimestamp(), handled: false });
      }
      alert("Lưu thành công.");
      setText("");
      setResult(null);
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại.");
    }
  };

  return (
    <div className="container my-4">
      <div className="card p-4">
        <h3>Viết tâm sự / Nhật ký</h3>
        <p className="text-muted">Bạn có thể chia sẻ điều bạn đang nghĩ — ẩn danh nếu muốn.</p>
        <textarea className="form-control" rows="6" value={text} onChange={e=>setText(e.target.value)} placeholder="Viết điều bạn muốn chia sẻ..."></textarea>
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary" onClick={doAnalyze}>Phân tích cảm xúc</button>
          <button className="btn btn-success" onClick={doSave}>Lưu (cần đăng nhập)</button>
          <div className="form-check align-self-center">
            <input className="form-check-input" type="checkbox" checked={anonymous} onChange={e=>setAnonymous(e.target.checked)} id="anonCheck" />
            <label className="form-check-label" htmlFor="anonCheck">Gửi ẩn danh</label>
          </div>
        </div>
        {result && <AnalyzeResult result={result} />}
      </div>
    </div>
  );
}
