import { byId, el } from './util.js';
import { getGoals, getTasks, addTask, setTaskDone, removeTask } from './storage.js';

const fillGoalSelects = () => {
  const goals = getGoals();
  const opts = ['<option value="">(Tanpa tautan)</option>'].concat(
    goals.map(g=>`<option value="${g.id}">${g.title}</option>`) 
  ).join('');
  byId('tGoal').innerHTML = opts;
  byId('tfGoal').innerHTML = '<option value="">Semua mimpi</option>' + goals.map(g=>`<option value="${g.id}">${g.title}</option>`).join('');
};

const render = () => {
  const q = byId('tfSearch').value.toLowerCase();
  const g = byId('tfGoal').value;
  const list = getTasks()
    .filter(t => !q || t.title.toLowerCase().includes(q))
    .filter(t => !g || String(t.goalId) === g)
    .sort((a,b)=> (a.due||'').localeCompare(b.due||''));

  const ul = byId('taskList'); ul.innerHTML='';
  list.forEach(t=>{
    const due = t.due ? `· Jatuh tempo ${t.due}` : '';
    const li = el(`
      <li>
        <div>
          <strong>${t.title}</strong>
          <div class="meta">${t.done?'Selesai':'Belum'} ${due}</div>
        </div>
        <div class="actions">
          <label style="display:inline-flex;gap:6px;align-items:center">
            <input type="checkbox" data-act="done" data-id="${t.id}" ${t.done?'checked':''} /> Selesai
          </label>
          <button class="btn-outline" data-act="del" data-id="${t.id}">Hapus</button>
        </div>
      </li>`);
    ul.appendChild(li);
  });
};

document.addEventListener('DOMContentLoaded', ()=>{
  fillGoalSelects();

  byId('taskForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const title = byId('tTitle').value.trim(); if(!title) return;
    const goalId = byId('tGoal').value ? Number(byId('tGoal').value) : null;
    const due = byId('tDue').value;
    const priority = byId('tPriority').value;
    addTask({ title, goalId, due, priority });
    e.target.reset();
    render();
  });

  byId('tfSearch').addEventListener('input', render);
  byId('tfGoal').addEventListener('change', render);

  byId('taskList').addEventListener('change', (e)=>{
    const t = e.target; if(t.dataset.act==='done') { setTaskDone(Number(t.dataset.id), t.checked); render(); }
  });
  byId('taskList').addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if(!btn) return;
    if(btn.dataset.act==='del'){ removeTask(Number(btn.dataset.id)); render(); }
  });

  render();
});
