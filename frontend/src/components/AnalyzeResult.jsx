// src/components/AnalyzeResult.jsx
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function AnalyzeResult({ result }) {
  if (!result) return null;
  const labels = ["vui", "buồn", "lo âu", "chán nản", "bình thường"];
  const scores = labels.map(l => result.scores?.[l] ?? 0);
  const data = { labels, datasets: [{ label: "Xác suất", data: scores, borderWidth: 1 }] };
  return (
    <div className="mt-3 p-3 bg-light rounded">
      <h5>Kết quả: <span className="text-primary">{result.label}</span></h5>
      <Bar data={data} />
    </div>
  );
}