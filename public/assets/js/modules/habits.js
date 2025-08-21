import { byId, el, today } from './util.js';
import { getHabits, addHabit, checkHabit, uncheckHabit } from './storage.js';

const render = () => {
  const q = byId('hfSearch').value.toLowerCase();
  const list = getHabits().filter(h=>!q || h.title.toLowerCase().includes(q));
  const ul = byId('habitList'); ul.innerHTML='';
  const d = today();
  list.forEach(h=>{
    const checked = h.history.includes(d);
    const li = el(`
      <li>
        <div>
          <strong>${h.title}</strong>
          <div class="meta">${h.schedule} · Streak: ${h.history.length} hari</div>
        </div>
        <div class="actions">
          <label style="display:inline-flex;gap:6px;align-items:center">
            <input type="checkbox" data-id="${h.id}" ${checked?'checked':''}/> Hari ini
          </label>
        </div>
      </li>`);
    ul.appendChild(li);
  });
};

document.addEventListener('DOMContentLoaded', ()=>{
  byId('habitForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const title = byId('hTitle').value.trim(); if(!title) return;
    const schedule = byId('hSchedule').value;
    addHabit({ title, schedule });
    e.target.reset();
    render();
  });

  byId('hfSearch').addEventListener('input', render);

  byId('habitList').addEventListener('change', (e)=>{
    const inp = e.target.closest('input[type="checkbox"]'); if(!inp) return;
    const id = Number(inp.dataset.id);
    if(inp.checked) checkHabit(id); else uncheckHabit(id);
    render();
  });

  render();
});
