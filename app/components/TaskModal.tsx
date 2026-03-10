'use client';

import { useState } from 'react';
import { Task, TaskStatus } from '../actions/types';
import { STATUS_CONFIG } from '../utils/config';
import { CloseIcon } from './icons';

export type TaskFormData = { title: string; description: string; status: TaskStatus };

type Props = {
  task: Task | null;
  onClose: () => void;
  onSave: (data: TaskFormData, id?: string) => void;
};

const TaskModal = ({ task, onClose, onSave }: Props) => {
  const isEdit = !!task;
  const [form, setForm] = useState<TaskFormData>({
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'todo',
  });
  const [titleError, setTitleError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setTitleError('Title is required');
      return;
    }
    onSave({ title: form.title.trim(), description: form.description.trim(), status: form.status }, task?.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-secondary relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60">
        <div className="via-primary absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

        <div className="p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="font-display text-foreground text-lg font-bold">{isEdit ? 'Edit task' : 'New task'}</h2>
              <p className="text-foreground-hover mt-0.5 text-xs">
                {isEdit ? 'Update your task details' : 'Add a new task to your board'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-secondary-hover text-foreground-hover hover:text-foreground mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-black/30 transition-all"
            >
              <CloseIcon />
            </button>
          </div>

          <form onSubmit={submit} className="flex flex-col gap-4">
            <div>
              <label className="text-foreground-hover mb-1.5 block text-xs font-medium">
                Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => {
                  setForm((f) => ({ ...f, title: e.target.value }));
                  setTitleError('');
                }}
                placeholder="Enter task title…"
                className={`w-full border bg-black/30 ${titleError ? 'border-rose-500/50' : 'border-white/6'} text-foreground placeholder:text-foreground-hover/50 focus:border-primary/50 rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none`}
                autoFocus
              />
              {titleError && <p className="mt-1 text-xs text-rose-400">{titleError}</p>}
            </div>

            <div>
              <label className="text-foreground-hover mb-1.5 block text-xs font-medium">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the task…"
                rows={3}
                className="text-foreground placeholder:text-foreground-hover/50 focus:border-primary/50 w-full resize-none rounded-xl border border-white/6 bg-black/30 px-3.5 py-2.5 text-sm transition-all focus:outline-none"
              />
            </div>

            <div>
              <label className="text-foreground-hover mb-2 block text-xs font-medium">Status</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(STATUS_CONFIG) as [TaskStatus, (typeof STATUS_CONFIG)[TaskStatus]][]).map(([s, sc]) => {
                  const selected = form.status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, status: s }))}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition-all ${
                        selected
                          ? `${sc.bg} ${sc.color} border-current/20 ring-1 ${sc.ring}`
                          : 'text-foreground-hover hover:text-foreground border-white/6 hover:border-white/10'
                      }`}
                    >
                      <div className={`h-2 w-2 rounded-full ${selected ? sc.dot : 'bg-foreground-hover/50'}`} />
                      {sc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="text-foreground-hover hover:text-foreground flex-1 rounded-xl border border-white/6 bg-black/30 py-2.5 text-sm font-medium transition-all hover:border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover shadow-primary/25 flex-1 rounded-xl py-2.5 text-sm font-medium text-white shadow-lg transition-all"
              >
                {isEdit ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
