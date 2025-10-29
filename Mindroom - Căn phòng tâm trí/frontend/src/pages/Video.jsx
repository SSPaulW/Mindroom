// src/pages/Video.jsx
import React, { useState } from "react";

export default function Video() {
  const [room, setRoom] = useState("");
  const start = () => {
    if (!room) return alert("Nhập tên phòng.");
    const url = `https://meet.jit.si/${encodeURIComponent(room)}`;
    window.open(url, "_blank");
  };
  return (
    <div className="container my-4">
      <div className="card p-4">
        <h3>Gọi video (Jitsi)</h3>
        <input className="form-control mb-2" placeholder="Tên phòng (vd: lop10a_phong1)" value={room} onChange={e=>setRoom(e.target.value)} />
        <button className="btn btn-primary" onClick={start}>Bắt đầu</button>
      </div>
    </div>
  );
}