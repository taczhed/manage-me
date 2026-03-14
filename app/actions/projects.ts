import { Project, CreateProjectInput, UpdateProjectInput } from './types';

const KEY = 'projects';

const load = () => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Project[]) : [];
};

const save = (items: Project[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};

export const getProjects = () => {
  return load();
};

export const getProject = (id: string) => {
  return load().find((p) => p.id === id);
};

export const createProject = (input: CreateProjectInput) => {
  const projects = load();
  const project: Project = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  save([...projects, project]);
  return project;
};

export const updateProject = (id: string, input: UpdateProjectInput) => {
  const projects = load();
  const index = projects.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  projects[index] = { ...projects[index], ...input };
  save(projects);
  return projects[index];
};

export const removeProject = (id: string) => {
  const projects = load();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  save(filtered);
  if (getActiveProjectId() === id) setActiveProjectId(null);
};

export const getActiveProjectId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('activeProjectId');
};

export const setActiveProjectId = (id: string | null) => {
  if (id === null) {
    localStorage.removeItem('activeProjectId');
  } else {
    localStorage.setItem('activeProjectId', id);
  }
};

export const getActiveProject = () => {
  const id = getActiveProjectId();
  if (!id) return null;
  return getProject(id) ?? null;
};
