const quotes = [
  "Small steps still move you forward.",
  "Discipline beats motivation.",
  "What gets scheduled gets done.",
  "Progress, not perfection."
];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

document.addEventListener("DOMContentLoaded", () => {
  const q = document.getElementById("quote");
  if (q) q.textContent = pick(quotes);
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
});
