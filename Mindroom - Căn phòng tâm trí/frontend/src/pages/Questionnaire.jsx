// src/pages/Questionnaire.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';

const QUESTIONS = [
  { id: 1, q: "Hôm nay bạn cảm thấy thế nào về năng lượng của mình?" ,
    options: [{k:"0", t:"Rất tệ"},{k:"1", t:"Tương đối tệ"},{k:"2", t:"Ổn"},{k:"3", t:"Rất tốt"}] },
  { id: 2, q: "Bạn có khó ngủ/tỉnh giấc không?" , options: [{k:"0","t":"Rất hay"},{k:"1","t":"Thỉnh thoảng"},{k:"2","t":"Ít khi"},{k:"3","t":"Không"}]},
  { id: 3, q: "Bạn có cảm thấy lo lắng không?" , options: [{k:"0","t":"Rất lo"},{k:"1","t":"Khá lo"},{k:"2","t":"Ít lo"},{k:"3","t":"Không"}]}
];

export default function Questionnaire(){
  const [user, setUser] = useState(null);
  const [answers, setAnswers] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(()=> onAuthStateChanged(auth, u=> setUser(u)), []);

  const submit = async () => {
    if (!user) return alert("Bạn cần đăng nhập để lưu kết quả.");
    // compute mood_score as sum of options (higher = better)
    let score = 0;
    for (const q of QUESTIONS) { score += Number(answers[q.id] ?? 0); }
    try {
      await addDoc(collection(db, "questionnaire_responses"), { uid: user.uid, answers, score, createdAt: serverTimestamp() });
      alert("Lưu kết quả thành công.");
      loadHistory();
    } catch (err) {
      console.error(err);
      alert("Lưu thất bại.");
    }
  };

  const loadHistory = async () => {
    if (!user) return;
    const q = query(collection(db, "questionnaire_responses"), where("uid","==",user.uid));
    const snap = await getDocs(q);
    const items = [];
    snap.forEach(d => items.push({ id: d.id, ...d.data() }));
    setHistory(items.sort((a,b)=> (b.createdAt?.seconds||0) - (a.createdAt?.seconds||0)));
  };

  useEffect(()=>{ if (user) loadHistory(); }, [user]);

  const chartData = {
    labels: history.map((h,i)=> new Date((h.createdAt?.seconds||0)*1000).toLocaleDateString()),
    datasets: [{ label: "Mood score", data: history.map(h=>h.score||0), borderColor:'#0d6efd', tension:0.2 }]
  };

  return (
    <div className="container my-4">
      <div className="card p-4">
        <h3>Daily Check-in</h3>
        <p className="text-muted">Làm khảo sát nhỏ để theo dõi cảm xúc hằng ngày.</p>
        {QUESTIONS.map(q => (
          <div key={q.id} className="mb-3">
            <label className="form-label">{q.q}</label>
            <select className="form-select" value={answers[q.id] ?? ""} onChange={e=>setAnswers({...answers, [q.id]: e.target.value})}>
              <option value="">Chọn</option>
              {q.options.map(o=> <option key={o.k} value={o.k}>{o.t}</option>)}
            </select>
          </div>
        ))}
        <button className="btn btn-primary" onClick={submit}>Lưu kết quả</button>

        <div className="mt-4">
          <h5>Xu hướng gần đây</h5>
          {history.length===0 ? <p>Chưa có dữ liệu.</p> : <Line data={chartData} />}
        </div>
      </div>
    </div>
  );
}