// src/api.js
export async function analyzeText(text) {
  const API_BASE = process.env.REACT_APP_API || "";
  if (!API_BASE) {
    // fallback ngay
    return fallbackPredict(text);
  }
  try {
    const res = await axios.post(`${API_BASE}/analyze`, { text });
    return res.data;
  } catch (err) {
    console.warn("API lỗi, dùng fallback:", err.message);
    return fallbackPredict(text);
  }
}

// fallback simple rule-based (demo)
function fallbackPredict(text) {
  const t = (text || "").toLowerCase();
  const mapping = [
    ["chán", "chán nản"],
    ["tuyệt vọng", "chán nản"],
    ["muốn chết", "chán nản"],
    ["buồn", "buồn"],
    ["khóc", "buồn"],
    ["mệt", "buồn"],
    ["lo", "lo âu"],
    ["lo lắng", "lo âu"],
    ["sợ", "lo âu"],
    ["vui", "vui"],
    ["hạnh phúc", "vui"],
    ["tốt", "vui"],
    ["bình thường", "bình thường"]
  ];
  for (const [kw, lbl] of mapping) {
    if (t.includes(kw)) {
      const scores = { "vui":0, "buồn":0, "lo âu":0, "chán nản":0, "bình thường":0 };
      scores[lbl] = 0.9;
      return { label: lbl, scores };
    }
  }
  return { label: "bình thường", scores: { "vui":0.05,"buồn":0.1,"lo âu":0.05,"chán nản":0.05,"bình thường":0.75 } };
}
