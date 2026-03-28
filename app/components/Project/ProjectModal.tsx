'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '../../actions/types';
import { getProjects, createProject, setActiveProjectId } from '../../actions/projects';
import { CloseIcon } from '../UI/Icons';
import Modal from '../UI/Modal';

type Props = {
  currentProjectId?: string;
  onClose: () => void;
};

const ProjectModal = ({ currentProjectId, onClose }: Props) => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newNameError, setNewNameError] = useState('');

  const handleSelect = (project: Project) => {
    setActiveProjectId(project.id);
    router.push('/projects/' + project.id);
    onClose();
  };

  const handleCreate = () => {
    const trimmed = newName.trim();

    if (!trimmed) {
      setNewNameError('Name is required');
      return;
    }

    const project = createProject({ name: trimmed, description: newDescription.trim() });
    setNewName('');
    setNewDescription('');
    setShowCreate(false);
    setNewNameError('');
    setActiveProjectId(project.id);
    router.push('/projects/' + project.id);
    onClose();
  };

  const handleCancelCreate = () => {
    setShowCreate(false);
    setNewName('');
    setNewDescription('');
    setNewNameError('');
  };

  return (
    <Modal onClose={onClose}>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-foreground font-semibold">Projects</h2>
        <button onClick={onClose} className="text-white/40 transition-colors hover:text-white/80">
          <CloseIcon />
        </button>
      </div>

      <div className="space-y-1.5">
        {projects.map((project) => {
          const isActive = project.id === currentProjectId;

          return (
            <div
              key={project.id}
              className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-all ${
                isActive ? 'border-primary/30 bg-primary/10' : 'border-white/6 hover:border-white/12 hover:bg-white/5'
              }`}
            >
              <button className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => handleSelect(project)}>
                <div className="bg-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white">
                  {project.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`truncate text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground'}`}>
                    {project.name}
                  </div>
                  {project.description && (
                    <div className="text-foreground-hover mt-0.5 truncate text-xs">{project.description}</div>
                  )}
                </div>
                {isActive && (
                  <span className="bg-primary/20 text-primary shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium">
                    Active
                  </span>
                )}
              </button>
            </div>
          );
        })}

        {projects.length === 0 && !showCreate && (
          <p className="text-foreground-hover py-3 text-center text-sm">No projects yet.</p>
        )}
      </div>

      <div className="mt-4 border-t border-white/6 pt-4">
        {showCreate ? (
          <div className="space-y-3">
            <div>
              <label className="text-foreground-hover mb-1.5 block text-xs font-medium tracking-wide uppercase">Name</label>
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNewNameError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Project name…"
                className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full rounded-xl border border-white/10 px-3 py-2.5 text-sm focus:outline-none"
              />
              {newNameError && <p className="mt-1 text-xs text-red-400">{newNameError}</p>}
            </div>
            <div>
              <label className="text-foreground-hover mb-1.5 block text-xs font-medium tracking-wide uppercase">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Optional description…"
                rows={2}
                className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full resize-none rounded-xl border border-white/10 px-3 py-2.5 text-sm focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="bg-primary hover:bg-primary-hover flex-1 rounded-xl py-2.5 text-sm font-medium text-white transition-colors"
              >
                Create project
              </button>
              <button
                onClick={handleCancelCreate}
                className="bg-secondary-hover flex-1 rounded-xl py-2.5 text-sm text-white/60 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="hover:border-primary/40 text-foreground-hover hover:text-foreground w-full rounded-xl border border-dashed border-white/10 py-2 text-sm transition-colors hover:bg-white/5"
          >
            + New project
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ProjectModal;
