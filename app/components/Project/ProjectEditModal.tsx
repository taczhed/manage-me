'use client';

import { useState } from 'react';
import { Project } from '../../actions/types';
import { CloseIcon } from '../UI/Icons';
import Modal from '../UI/Modal';

type Props = {
  project: Project;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
};

const ProjectEditModal = ({ project, onClose, onSave }: Props) => {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [nameError, setNameError] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Name is required');
      return;
    }
    onSave(trimmed, description.trim());
  };

  return (
    <Modal onClose={onClose}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-foreground font-semibold">Edit project</h2>
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
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setNameError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Project name…"
            className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full rounded-xl border border-white/10 px-3 py-2.5 text-sm focus:outline-none"
          />
          {nameError && <p className="mt-1 text-xs text-red-400">{nameError}</p>}
        </div>

        <div>
          <label className="text-foreground-hover mb-1.5 block text-xs font-medium tracking-wide uppercase">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description…"
            rows={3}
            className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full resize-none rounded-xl border border-white/10 px-3 py-2.5 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary-hover flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition-colors"
        >
          Save changes
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

export default ProjectEditModal;
