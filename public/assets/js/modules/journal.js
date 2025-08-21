import { byId, el } from './util.js';
import { getJournal, addJournal, removeJournal } from './storage.js';

const render = () => {
  const q = byId('jfSearch').value.toLowerCase();
  const list = getJournal()
    .filter(j => !q || j.text.toLowerCase().includes(q))
    .sort((a,b)=> (b.date||'').localeCompare(a.date||''));

  const ul = byId('journalList'); ul.innerHTML='';
  list.forEach(j=>{
    const mood = j.mood>0?'😊':(j.mood<0?'☹️':'😐');
    const li = el(`
      <li>
        <div>
          <strong>${j.date} ${mood}</strong>
          <div class="meta">${j.text}</div>
        </div>
        <div class="actions">
          <button class="btn-outline" data-id="${j.id}">Hapus</button>
        </div>
      </li>`);
    ul.appendChild(li);
  });
};

document.addEventListener('DOMContentLoaded', ()=>{
  const d = new Date().toISOString().slice(0,10);
  if(byId('jDate')) byId('jDate').value = d;

  byId('journalForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const date = byId('jDate').value || d;
    const mood = byId('jMood').value;
    const text = byId('jText').value.trim(); if(!text) return;
    addJournal({ date, mood, text });
    e.target.reset(); byId('jDate').value = d;
    render();
  });

  byId('jfSearch').addEventListener('input', render);

  byId('journalList').addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if(!btn) return;
    removeJournal(Number(btn.dataset.id)); render();
  });

  render();
});
