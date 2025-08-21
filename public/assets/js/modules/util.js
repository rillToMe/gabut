export const uid = () => Math.floor(Math.random() * 1e9);
export const today = () => new Date().toISOString().slice(0,10);
export const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
export const load = (k, def=[]) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch { return def; }
};
export const byId = (id) => document.getElementById(id);
export const el = (html) => {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
};
