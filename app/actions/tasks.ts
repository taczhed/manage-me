import { Task, CreateTaskInput, UpdateTaskInput } from './types';

const KEY = 'tasks';

const load = () => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Task[]) : [];
}

const save = (items: Task[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export const getTasks = () => {
  return load();
}

export const getTask = (id: string) => {
  return load().find((t) => t.id === id);
}

export const createTask = (input: CreateTaskInput) => {
  const tasks = load();
  const task: Task = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...input };
  save([...tasks, task]);
  return task;
}

export const updateTask = (id: string, input: UpdateTaskInput) => {
  const tasks = load();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  tasks[index] = { ...tasks[index], ...input };
  save(tasks);
  return tasks[index];
}

export const removeTask = (id: string) => {
  const tasks = load();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) return false;
  save(filtered);
}
