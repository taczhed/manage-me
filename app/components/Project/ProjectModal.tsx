'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '../../actions/types';
import { getProjects, createProject, updateProject, removeProject, setActiveProjectId } from '../../actions/projects';
import { getStories, removeStory } from '../../actions/stories';
import { CloseIcon, PencilIcon, TrashIcon } from '../UI/Icons';
import Modal from '../UI/Modal';

type Props = {
  currentProjectId?: string;
  onClose: () => void;
  onProjectUpdated?: (project: Project) => void;
};

const ProjectModal = ({ currentProjectId, onClose, onProjectUpdated }: Props) => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(() => getProjects());
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editNameError, setEditNameError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newNameError, setNewNameError] = useState('');

  const refresh = () => setProjects(getProjects());

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

  const handleEditSave = () => {
    const trimmed = editName.trim();

    if (!trimmed) {
      setEditNameError('Name is required');
      return;
    }

    const updated = updateProject(editProject!.id, { name: trimmed, description: editDescription.trim() });

    if (updated && updated.id === currentProjectId) {
      onProjectUpdated?.(updated);
    }

    refresh();
    setEditProject(null);
    setEditNameError('');
  };

  const handleOpenEdit = (project: Project) => {
    setEditProject(project);
    setEditName(project.name);
    setEditDescription(project.description || '');
    setEditNameError('');
    setShowCreate(false);
  };

  const handleOpenCreate = () => {
    setShowCreate(true);
    setEditProject(null);
  };

  const handleCancelEdit = () => {
    setEditProject(null);
    setEditNameError('');
  };

  const handleCancelCreate = () => {
    setShowCreate(false);
    setNewName('');
    setNewDescription('');
    setNewNameError('');
  };

  const handleDelete = (id: string) => {
    const stories = getStories(id);
    stories.forEach((s) => removeStory(s.id));
    removeProject(id);
    refresh();

    if (id === currentProjectId) {
      router.push('/');
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="font-display text-foreground text-lg font-bold">Projects</h2>
          <p className="text-foreground-hover mt-0.5 text-xs">Manage and switch between projects</p>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-secondary-hover text-foreground-hover hover:text-foreground mt-0.5 flex h-8 w-8 items-center justify-center rounded-xl bg-black/30 transition-all"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="space-y-1.5">
        {projects.map((project) => {
          const isActive = project.id === currentProjectId;
          const isEditing = editProject?.id === project.id;

          if (isEditing) {
            return (
              <div key={project.id} className="space-y-2 rounded-xl border border-white/12 bg-white/5 p-3">
                <div>
                  <input
                    autoFocus
                    type="text"
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
                      setEditNameError('');
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
                    placeholder="Project name"
                    className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:outline-none"
                  />
                  {editNameError && <p className="mt-1 text-xs text-red-400">{editNameError}</p>}
                </div>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description (optional)"
                  rows={2}
                  className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full resize-none rounded-lg border border-white/10 px-3 py-2 text-sm focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEditSave}
                    className="bg-primary hover:bg-primary-hover flex-1 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-secondary-hover rounded-lg px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={project.id}
              className={`group flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-all ${
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
              <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => handleOpenEdit(project)}
                  className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="rounded-lg p-1.5 text-red-400/50 transition-colors hover:bg-red-400/10 hover:text-red-400"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && !showCreate && (
          <p className="text-foreground-hover py-3 text-center text-sm">No projects yet.</p>
        )}
      </div>

      <div className="mt-4 border-t border-white/6 pt-4">
        {showCreate ? (
          <div className="space-y-2">
            <div>
              <input
                autoFocus
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setNewNameError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Project name"
                className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:outline-none"
              />
              {newNameError && <p className="mt-1 text-xs text-red-400">{newNameError}</p>}
            </div>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full resize-none rounded-lg border border-white/10 px-3 py-2 text-sm focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="bg-primary hover:bg-primary-hover flex-1 rounded-lg px-3 py-1.5 text-sm font-medium text-white transition-colors"
              >
                Create
              </button>
              <button
                onClick={handleCancelCreate}
                className="bg-secondary-hover rounded-lg px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleOpenCreate}
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
