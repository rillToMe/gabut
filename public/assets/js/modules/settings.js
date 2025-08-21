import { exportAll, importAll } from './storage.js';

const download = (filename, dataStr) => {
  const a = document.createElement('a');
  a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  a.download = filename; a.click();
};

document.addEventListener('DOMContentLoaded', ()=>{
  const exp = document.getElementById('btnExport');
  const imp = document.getElementById('importFile');

  exp.addEventListener('click', ()=>{
    const data = exportAll();
    download('dreamhub-backup.json', JSON.stringify(data, null, 2));
  });

  imp.addEventListener('change', async (e)=>{
    const file = e.target.files[0]; if(!file) return;
    const text = await file.text();
    try { importAll(JSON.parse(text)); alert('Import berhasil!'); }
    catch { alert('File tidak valid.'); }
  });
});
