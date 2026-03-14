'use client';

import { useState } from 'react';
import { Story, StoryStatus, StoryPriority } from '../../actions/types';
import { CloseIcon } from '../UI/Icons';
import Modal from '../UI/Modal';

export type StoryFormData = {
  name: string;
  description: string;
  priority: StoryPriority;
  status: StoryStatus;
};

type Props = {
  story: Story | null;
  defaultStatus?: StoryStatus;
  onClose: () => void;
  onSave: (data: StoryFormData, id?: string) => void;
};

const PRIORITIES: { value: StoryPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
  { value: 'medium', label: 'Medium', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
  { value: 'high', label: 'High', color: 'text-rose-400 bg-rose-400/10 border-rose-400/30' },
];

const STATUSES: { value: StoryStatus; label: string; color: string }[] = [
  { value: 'todo', label: 'Todo', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
  { value: 'doing', label: 'Doing', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30' },
  { value: 'done', label: 'Done', color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' },
];

const StoryModal = ({ story, defaultStatus = 'todo', onClose, onSave }: Props) => {
  const [form, setForm] = useState<StoryFormData>({
    name: story?.name || '',
    description: story?.description || '',
    priority: story?.priority || 'medium',
    status: story?.status || defaultStatus,
  });
  const [nameError, setNameError] = useState('');

  const handleSubmit = () => {
    const trimmed = form.name.trim();
    if (!trimmed) {
      setNameError('Name is required');
      return;
    }
    onSave({ ...form, name: trimmed }, story?.id);
  };

  return (
    <Modal onClose={onClose}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-foreground font-semibold">{story ? 'Edit story' : 'New story'}</h2>
        <button onClick={onClose} className="text-white/40 transition-colors hover:text-white/80">
          <CloseIcon />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-foreground-hover mb-1.5 block text-xs font-medium tracking-wide uppercase">Name</label>
          <input
            autoFocus
            type="text"
            value={form.name}
            onChange={(e) => {
              setForm((f) => ({ ...f, name: e.target.value }));
              setNameError('');
            }}
            placeholder="Story name…"
            className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full rounded-xl border border-white/10 px-3 py-2.5 text-sm focus:outline-none"
          />
          {nameError && <p className="mt-1 text-xs text-red-400">{nameError}</p>}
        </div>

        <div>
          <label className="text-foreground-hover mb-1.5 block text-xs font-medium tracking-wide uppercase">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Optional description…"
            rows={3}
            className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full resize-none rounded-xl border border-white/10 px-3 py-2.5 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label className="text-foreground-hover mb-1.5 block text-xs font-medium tracking-wide uppercase">Priority</label>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                onClick={() => setForm((f) => ({ ...f, priority: p.value }))}
                className={`flex-1 rounded-xl border py-2 text-xs font-medium transition-all ${
                  form.priority === p.value
                    ? p.color
                    : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-foreground-hover mb-1.5 block text-xs font-medium tracking-wide uppercase">Status</label>
          <div className="flex gap-2">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => setForm((f) => ({ ...f, status: s.value }))}
                className={`flex-1 rounded-xl border py-2 text-xs font-medium transition-all ${
                  form.status === s.value ? s.color : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary-hover flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition-colors"
        >
          {story ? 'Save changes' : 'Create story'}
        </button>
        <button
          onClick={onClose}
          className="bg-secondary-hover flex-1 rounded-xl py-2.5 text-sm text-white/60 transition-colors hover:bg-white/10"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default StoryModal;
