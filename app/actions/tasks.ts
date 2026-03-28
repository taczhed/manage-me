import { Task, CreateTaskInput, UpdateTaskInput } from './types';
import { users } from './users';
import { getStory, updateStory } from './stories';

const KEY = 'tasks';

const load = () => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Task[]) : [];
};

const save = (items: Task[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};

export const getTasks = (storyId?: string) => {
  const tasks = load();
  return storyId ? tasks.filter((t) => t.storyId === storyId) : tasks;
};

export const getTask = (id: string) => {
  return load().find((t) => t.id === id);
};

export const createTask = (input: CreateTaskInput) => {
  const tasks = load();
  const task: Task = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  save([...tasks, task]);
  return task;
};

export const updateTask = (id: string, input: UpdateTaskInput) => {
  const tasks = load();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  tasks[index] = { ...tasks[index], ...input, updatedAt: new Date().toISOString() };
  save(tasks);
  return tasks[index];
};

export const removeTask = (id: string) => {
  const tasks = load();
  const filtered = tasks.filter((t) => t.id !== id);
  if (filtered.length === tasks.length) return false;
  save(filtered);
};

export const assignTask = (taskId: string, assigneeId: string) => {
  const user = users.find((u) => u.id === assigneeId);
  if (!user || (user.role !== 'developer' && user.role !== 'devops')) return undefined;

  updateTask(taskId, { assigneeId });

  const task = getTask(taskId);

  if (!task) return undefined;

  const now = new Date().toISOString();
  if (task.status === 'todo') {
    updateTask(taskId, { status: 'doing', startDate: now });
  }

  const story = getStory(task.storyId);
  if (story && story.status === 'todo') {
    updateStory(task.storyId, { status: 'doing' });
  }

  return getTask(taskId);
};

export const completeTask = (taskId: string) => {
  const task = getTask(taskId);
  if (!task) return undefined;

  const now = new Date().toISOString();
  updateTask(taskId, { status: 'done', completionDate: now });

  const storyTasks = getTasks(task.storyId);
  const allDone = storyTasks.every((t) => t.id === taskId || t.status === 'done');
  if (allDone) {
    updateStory(task.storyId, { status: 'done' });
  }

  return getTask(taskId);
};

export const logHours = (taskId: string, hours: number) => {
  return updateTask(taskId, { loggedHours: hours });
};
