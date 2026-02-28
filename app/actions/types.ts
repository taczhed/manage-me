export interface Task {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export type CreateTaskInput = Omit<Task, 'id' | 'createdAt'>;
export type UpdateTaskInput = Partial<CreateTaskInput>;