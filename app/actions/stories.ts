import { Story, CreateStoryInput, UpdateStoryInput } from './types';

const KEY = 'stories';

const load = () => {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as Story[]) : [];
};

const save = (items: Story[]) => {
  localStorage.setItem(KEY, JSON.stringify(items));
};

export const getStories = (projectId?: string) => {
  const stories = load();
  return projectId ? stories.filter((s) => s.projectId === projectId) : stories;
};

export const getStory = (id: string) => {
  return load().find((s) => s.id === id);
};

export const createStory = (input: CreateStoryInput) => {
  const stories = load();
  const story: Story = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...input,
  };
  save([...stories, story]);
  return story;
};

export const updateStory = (id: string, input: UpdateStoryInput) => {
  const stories = load();
  const index = stories.findIndex((s) => s.id === id);
  if (index === -1) return undefined;
  stories[index] = { ...stories[index], ...input };
  save(stories);
  return stories[index];
};

export const removeStory = (id: string) => {
  const stories = load();
  const filtered = stories.filter((s) => s.id !== id);
  if (filtered.length === stories.length) return false;
  save(filtered);
};
