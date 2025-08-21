import { byId, el } from './util.js';
import { getGoals, addGoal, setGoalStatus, removeGoal } from './storage.js';

const render = () => {
  const q = byId('fSearch').value.toLowerCase();
  const st = byId('fStatus').value;
  const list = getGoals()
    .filter(g => !q || g.title.toLowerCase().includes(q) || (g.category||'').toLowerCase().includes(q))
    .filter(g => !st || g.status === st)
    .sort((a,b)=> a.priority - b.priority || a.title.localeCompare(b.title));

  const ul = byId('goalList'); ul.innerHTML = '';
  list.forEach(g => {
    const li = el(`
      <li>
        <div>
          <strong>${g.title}</strong>
          <div class="meta">${g.category || 'General'} · Prioritas ${g.priority} · Status: ${g.status}</div>
        </div>
        <div class="actions">
          <select data-act="status" data-id="${g.id}">
            <option value="pending" ${g.status==='pending'?'selected':''}>Pending</option>
            <option value="in-progress" ${g.status==='in-progress'?'selected':''}>In Progress</option>
            <option value="done" ${g.status==='done'?'selected':''}>Selesai</option>
          </select>
          <button class="btn-outline" data-act="del" data-id="${g.id}">Hapus</button>
        </div>
      </li>`);
    ul.appendChild(li);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  byId('goalForm').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const title = byId('gTitle').value.trim(); if(!title) return;
    const category = byId('gCategory').value.trim();
    const priority = byId('gPriority').value;
    await addGoal({ title, category, priority });
    e.target.reset();
    render();
  });
  byId('fSearch').addEventListener('input', render);
  byId('fStatus').addEventListener('change', render);

  byId('goalList').addEventListener('change', (e)=>{
    const t = e.target; if(t.dataset.act==='status'){
      setGoalStatus(Number(t.dataset.id), t.value); render();
    }
  });
  byId('goalList').addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if(!btn) return;
    if(btn.dataset.act==='del') { removeGoal(Number(btn.dataset.id)); render(); }
  });

  render();
});
