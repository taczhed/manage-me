export type TaskStatus = 'todo' | 'doing' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt?: string;
  storyId?: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export type CreateProjectInput = Omit<Project, 'id' | 'createdAt'>;
export type UpdateProjectInput = Partial<CreateProjectInput>;

export type StoryStatus = 'todo' | 'doing' | 'done';
export type StoryPriority = 'low' | 'medium' | 'high';

export interface Story {
  id: string;
  name: string;
  description: string;
  priority: StoryPriority;
  projectId: string;
  createdAt: string;
  status: StoryStatus;
  ownerId: string;
}

export type CreateStoryInput = Omit<Story, 'id' | 'createdAt'>;
export type UpdateStoryInput = Partial<CreateStoryInput>;
