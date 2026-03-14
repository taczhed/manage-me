'use client';

import { useState } from 'react';
import { Project } from '../../actions/types';
import { PencilIcon, TrashIcon } from '../UI/Icons';
import Modal from '../UI/Modal';

type Props = {
  projects: Project[];
  onSelect: (project: Project) => void;
  onCreate: (name: string, description: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, name: string, description: string) => void;
};

const ProjectSelector = ({ projects, onSelect, onCreate, onDelete, onEdit }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editNameError, setEditNameError] = useState('');

  const handleEditSave = () => {
    const trimmed = editName.trim();
    if (!trimmed) {
      setEditNameError('Name is required');
      return;
    }
    onEdit(editProject!.id, trimmed, editDescription.trim());
    setEditProject(null);
    setEditNameError('');
  };

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Name is required');
      return;
    }
    onCreate(trimmed, description.trim());
    setName('');
    setDescription('');
    setShowForm(false);
    setNameError('');
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-8">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">Select a project</h1>
        <p className="text-foreground-hover mt-1 text-sm">Choose a project to view and manage its stories.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-secondary group relative flex cursor-pointer flex-col gap-2 rounded-2xl border border-white/8 p-4 transition-all hover:border-white/15 hover:bg-white/5"
            onClick={() => onSelect(project)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="bg-primary/20 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white">
                {project.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditProject(project);
                    setEditName(project.name);
                    setEditDescription(project.description || '');
                    setEditNameError('');
                  }}
                  className="rounded-lg p-1.5 text-white/40 opacity-0 transition-all group-hover:opacity-100 hover:bg-white/10 hover:text-white/70"
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project.id);
                  }}
                  className="rounded-lg p-1.5 text-red-400/60 opacity-0 transition-all group-hover:opacity-100 hover:bg-red-400/10 hover:text-red-400"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
            <div>
              <div className="text-foreground font-medium">{project.name}</div>
              {project.description && (
                <div className="text-foreground-hover mt-0.5 line-clamp-2 text-sm">{project.description}</div>
              )}
            </div>
            <div className="text-foreground-hover text-xs">
              {new Date(project.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        ))}

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-secondary hover:border-primary/40 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 p-4 text-sm transition-all hover:bg-white/5"
          >
            <span className="text-primary text-2xl leading-none font-bold">+</span>
            <span className="text-foreground-hover">New project</span>
          </button>
        ) : (
          <div className="bg-secondary space-y-3 rounded-2xl border border-white/15 p-4">
            <div>
              <input
                autoFocus
                type="text"
                placeholder="Project name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:outline-none"
              />
              {nameError && <p className="mt-1 text-xs text-red-400">{nameError}</p>}
            </div>
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                onClick={() => {
                  setShowForm(false);
                  setName('');
                  setDescription('');
                  setNameError('');
                }}
                className="bg-secondary-hover rounded-lg px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {editProject && (
        <Modal onClose={() => setEditProject(null)}>
          <div className="space-y-3">
            <h2 className="text-foreground mb-3 text-base font-semibold">Edit project</h2>
            <div>
              <input
                autoFocus
                type="text"
                placeholder="Project name"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                  setEditNameError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleEditSave()}
                className="bg-secondary-hover text-foreground placeholder-foreground-hover/50 focus:border-primary/50 w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:outline-none"
              />
              {editNameError && <p className="mt-1 text-xs text-red-400">{editNameError}</p>}
            </div>
            <textarea
              placeholder="Description (optional)"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
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
                onClick={() => setEditProject(null)}
                className="bg-secondary-hover rounded-lg px-3 py-1.5 text-sm text-white/60 transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}


    </div>
  );
};

export default ProjectSelector;
