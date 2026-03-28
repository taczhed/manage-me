'use client';

import { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../actions/types';
import { users } from '../../actions/users';
import { STATUS_CONFIG } from '../../utils/config';
import { CloseIcon } from '../UI/Icons';
import Modal from '../UI/Modal';

const eligibleUsers = users.filter((u) => u.role === 'developer' || u.role === 'devops');

const STATUSES: { value: TaskStatus; label: string; bg: string; color: string; dot: string; ring: string }[] = [
  { value: 'todo', ...STATUS_CONFIG.todo },
  { value: 'doing', ...STATUS_CONFIG.doing },
  { value: 'done', ...STATUS_CONFIG.done },
];

const PRIORITIES: { value: TaskPriority; label: string; color: string; bg: string; ring: string }[] = [
  { value: 'low', label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-400/10', ring: 'ring-emerald-400/30' },
  { value: 'medium', label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400/10', ring: 'ring-amber-400/30' },
  { value: 'high', label: 'High', color: 'text-rose-400', bg: 'bg-rose-400/10', ring: 'ring-rose-400/30' },
];

export type TaskFormData = {
  name: string;
  description: string;
  priority: TaskPriority;
  estimatedTime: number;
  status: TaskStatus;
  assigneeId?: string;
  loggedHours?: number;
};

type Props = {
  task: Task | null;
  defaultStatus?: TaskStatus;
  onClose: () => void;
  onSave: (data: TaskFormData, id?: string) => void;
};

const TaskModal = ({ task, defaultStatus = 'todo', onClose, onSave }: Props) => {
  const isEdit = !!task;
  const [nameError, setNameError] = useState('');
  const [form, setForm] = useState<TaskFormData>({
    name: task?.name || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    estimatedTime: task?.estimatedTime || 0,
    status: task?.status || defaultStatus,
    assigneeId: task?.assigneeId || '',
    loggedHours: task?.loggedHours || 0,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setNameError('Name is required');
      return;
    }

    onSave({ ...form, name: form.name.trim(), description: form.description.trim() }, task?.id);
  };

  return (
    <Modal onClose={onClose}>
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
            Name <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              setForm((f) => ({ ...f, name: e.target.value }));
              setNameError('');
            }}
            placeholder="Enter task name…"
            className={`w-full border bg-black/30 ${nameError ? 'border-rose-500/50' : 'border-white/6'} text-foreground placeholder:text-foreground-hover/50 focus:border-primary/50 rounded-xl px-3.5 py-2.5 text-sm transition-all focus:outline-none`}
            autoFocus
          />
          {nameError && <p className="mt-1 text-xs text-rose-400">{nameError}</p>}
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
          <label className="text-foreground-hover mb-2 block text-xs font-medium">Priority</label>
          <div className="grid grid-cols-3 gap-2">
            {PRIORITIES.map((p) => {
              const selected = form.priority === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, priority: p.value }))}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                    selected
                      ? `${p.bg} ${p.color} border-current/20 ring-1 ${p.ring}`
                      : 'text-foreground-hover hover:text-foreground border-white/6 hover:border-white/10'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-foreground-hover mb-1.5 block text-xs font-medium">Estimated time (hours)</label>
          <input
            type="number"
            value={form.estimatedTime}
            onChange={(e) => setForm((f) => ({ ...f, estimatedTime: parseFloat(e.target.value) || 0 }))}
            min="0"
            step="0.5"
            className="text-foreground placeholder:text-foreground-hover/50 focus:border-primary/50 w-full rounded-xl border border-white/6 bg-black/30 px-3.5 py-2.5 text-sm transition-all focus:outline-none"
          />
        </div>

        <div>
          <label className="text-foreground-hover mb-2 block text-xs font-medium">Status</label>
          <div className="grid grid-cols-3 gap-2">
            {STATUSES.map((s) => {
              const selected = form.status === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, status: s.value }))}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition-all ${
                    selected
                      ? `${s.bg} ${s.color} border-current/20 ring-1 ${s.ring}`
                      : 'text-foreground-hover hover:text-foreground border-white/6 hover:border-white/10'
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full ${selected ? s.dot : 'bg-foreground-hover/50'}`} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-foreground-hover mb-1.5 block text-xs font-medium">Assign person</label>
          <select
            value={form.assigneeId || ''}
            onChange={(e) => setForm((f) => ({ ...f, assigneeId: e.target.value }))}
            className="text-foreground bg-secondary focus:border-primary/50 w-full rounded-xl border border-white/6 px-3.5 py-2.5 text-sm transition-all focus:outline-none"
          >
            <option value="">Unassigned</option>
            {eligibleUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName} ({u.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-foreground-hover mb-1.5 block text-xs font-medium">Log hours</label>
          <input
            type="number"
            value={form.loggedHours || 0}
            onChange={(e) => setForm((f) => ({ ...f, loggedHours: parseFloat(e.target.value) || 0 }))}
            min="0"
            step="0.5"
            className="text-foreground placeholder:text-foreground-hover/50 focus:border-primary/50 w-full rounded-xl border border-white/6 bg-black/30 px-3.5 py-2.5 text-sm transition-all focus:outline-none"
          />
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
    </Modal>
  );
};

export default TaskModal;
