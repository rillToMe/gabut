import { uid, today, save, load } from './util.js';

const KEYS = {
  GOALS: 'dh_goals',
  TASKS: 'dh_tasks',
  HABITS:'dh_habits',
  JOURN: 'dh_journal'
};

export const getGoals = () => load(KEYS.GOALS);
export const addGoal = async ({ title, category='General', priority=2 }) => {
  const list = getGoals();
  const item = { id: uid(), title, category, priority: Number(priority), status: 'pending', milestones: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  list.push(item); save(KEYS.GOALS, list); return item;
};
export const setGoalStatus = (id, status) => {
  const list = getGoals();
  const i = list.findIndex(g=>g.id===id); if(i===-1) return;
  list[i].status = status; list[i].updatedAt = new Date().toISOString(); save(KEYS.GOALS, list);
};
export const removeGoal = (id) => { save(KEYS.GOALS, getGoals().filter(g=>g.id!==id)); };

export const getTasks = () => load(KEYS.TASKS);
export const addTask = ({ title, goalId=null, due='', priority=2 }) => {
  const list = getTasks();
  const item = { id: uid(), goalId, title, due, priority: Number(priority), done: false, createdAt: new Date().toISOString() };
  list.push(item); save(KEYS.TASKS, list); return item;
};
export const setTaskDone = (id, done) => {
  const list = getTasks(); const i=list.findIndex(t=>t.id===id); if(i===-1) return;
  list[i].done = !!done; save(KEYS.TASKS, list);
};
export const removeTask = (id) => save(KEYS.TASKS, getTasks().filter(t=>t.id!==id));

export const getHabits = () => load(KEYS.HABITS);
export const addHabit = ({ title, schedule='daily' }) => {
  const list = getHabits();
  const item = { id: uid(), title, schedule, history: [] };
  list.push(item); save(KEYS.HABITS, list); return item;
};
export const checkHabit = (id, date=today()) => {
  const list = getHabits(); const i=list.findIndex(h=>h.id===id); if(i===-1) return;
  if(!list[i].history.includes(date)) list[i].history.push(date);
  save(KEYS.HABITS, list);
};
export const uncheckHabit = (id, date=today()) => {
  const list = getHabits(); const i=list.findIndex(h=>h.id===id); if(i===-1) return;
  list[i].history = list[i].history.filter(d=>d!==date); save(KEYS.HABITS, list);
};

export const getJournal = () => load(KEYS.JOURN);
export const addJournal = ({ date=today(), mood=0, text='' }) => {
  const list = getJournal(); const item = { id: uid(), date, mood: Number(mood), text };
  list.push(item); save(KEYS.JOURN, list); return item;
};
export const removeJournal = (id) => save(KEYS.JOURN, getJournal().filter(j=>j.id!==id));

export const exportAll = () => ({
  goals: getGoals(), tasks: getTasks(), habits: getHabits(), journal: getJournal()
});
export const importAll = (obj) => {
  if(obj?.goals) save(KEYS.GOALS, obj.goals);
  if(obj?.tasks) save(KEYS.TASKS, obj.tasks);
  if(obj?.habits) save(KEYS.HABITS, obj.habits);
  if(obj?.journal) save(KEYS.JOURN, obj.journal);
};
