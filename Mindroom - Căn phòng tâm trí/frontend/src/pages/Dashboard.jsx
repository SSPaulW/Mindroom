// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";

export default function Dashboard(){
  const [alerts, setAlerts] = useState([]);

  useEffect(()=>{
    const q = query(collection(db, "entries"));
    // we'll subscribe to entries and filter client-side for flagged ones
    const unsub = onSnapshot(collection(db, "entries"), snapshot => {
      const arr = [];
      snapshot.forEach(d=>{
        const data = d.data();
        // consider flagged if label in severe
        if (["buồn","chán nản","lo âu"].includes(data.label)) {
          arr.push({ id: d.id, ...data });
        }
      });
      setAlerts(arr.sort((a,b)=> (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0)));
    });
    return unsub;
  },[]);

  const handleMark = async (id) => {
    try {
      await updateDoc(doc(db, "entries", id), { handled: true, handledAt: new Date() });
      alert("Marked handled.");
    } catch (err) {
      console.error(err);
      alert("Error.");
    }
  };

  return (
    <div className="container my-4">
      <div className="card p-4">
        <h3>Teacher Dashboard — Alerts</h3>
        {alerts.length===0 ? <p>Không có cảnh báo.</p> : alerts.map(a=> (
          <div key={a.id} className="border rounded p-3 mb-2">
            <div className="d-flex justify-content-between">
              <div><strong>{a.label}</strong> — {a.anonymous ? "Ẩn danh" : a.email}</div>
              <div>{a.createdAt?.toDate ? new Date(a.createdAt.toDate()).toLocaleString() : ""}</div>
            </div>
            <p className="mt-2">{a.text}</p>
            <div>
              <button className="btn btn-sm btn-success me-2" onClick={()=>handleMark(a.id)}>Đã xử lý</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}