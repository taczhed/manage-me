'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project, User, StoryStatus } from '../../actions/types';
import { getStories, createStory, removeStory } from '../../actions/stories';
import { updateProject, removeProject } from '../../actions/projects';
import { PencilIcon, TrashIcon } from '../UI/Icons';
import StoryModal, { StoryFormData } from './StoryModal';
import StoryCard from './StoryCard';
import ProjectModal from '../Project/ProjectModal';
import ProjectEditModal from '../Project/ProjectEditModal';

type Props = {
  project: Project;
  user: User;
};

const COLUMNS: { status: StoryStatus; label: string; dot: string; accent: string }[] = [
  { status: 'todo', label: 'Todo', dot: 'bg-amber-400', accent: 'border-amber-400/20' },
  { status: 'doing', label: 'Doing', dot: 'bg-blue-400', accent: 'border-blue-400/20' },
  { status: 'done', label: 'Done', dot: 'bg-emerald-400', accent: 'border-emerald-400/20' },
];

const StoryBoard = ({ project, user }: Props) => {
  const router = useRouter();
  const [stories, setStories] = useState(() => getStories(project.id));
  const [showModal, setShowModal] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<StoryStatus>('todo');
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [localProject, setLocalProject] = useState(project);

  const refresh = () => setStories(getStories(project.id));

  const handleSave = (data: StoryFormData, _id?: string) => {
    createStory({ ...data, projectId: project.id, ownerId: user.id });
    refresh();
    setShowModal(false);
  };

  const handleEditSave = (name: string, description: string) => {
    const updated = updateProject(localProject.id, { name, description });
    if (updated) setLocalProject(updated);
    setShowEdit(false);
  };

  const handleDelete = () => {
    getStories(localProject.id).forEach((s) => removeStory(s.id));
    removeProject(localProject.id);
    router.push('/');
  };

  const openCreate = (status: StoryStatus) => {
    setDefaultStatus(status);
    setShowModal(true);
  };

  return (
    <>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-6">
          <button
            onClick={() => setShowSwitcher(true)}
            className="text-foreground-hover hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            Change project
          </button>
          <div className="mt-3 flex flex-wrap items-start gap-3">
            <h1 className="text-foreground flex-1 text-2xl font-bold tracking-tight">
              <span className="text-foreground/20 mr-1 font-light">Project: </span>
              {localProject.name}
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEdit(true)}
                className="rounded-xl border border-white/6 bg-black/30 p-2 text-white/50 transition-all hover:border-white/10 hover:text-white/80"
                title="Edit project"
              >
                <PencilIcon />
              </button>
              <button
                onClick={handleDelete}
                className="rounded-xl border border-white/6 bg-black/30 p-2 text-red-400/50 transition-all hover:border-red-400/20 hover:text-red-400"
                title="Delete project"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
          {localProject.description && <p className="text-foreground-hover mt-2 text-sm">{localProject.description}</p>}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {COLUMNS.map(({ status, label, dot, accent }) => {
            const col = stories.filter((s) => s.status === status);
            return (
              <div key={status} className={`rounded-2xl border ${accent} bg-white/[0.02] p-3`}>
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                    <span className="text-foreground text-sm font-semibold">{label}</span>
                    <span className="bg-secondary text-foreground-hover rounded-full px-1.5 py-0.5 text-[11px]">
                      {col.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openCreate(status)}
                    className="text-foreground-hover hover:text-foreground rounded-lg p-1 text-lg leading-none transition-colors hover:bg-white/10"
                    title={`Add ${label} story`}
                  >
                    +
                  </button>
                </div>

                <div className="space-y-2">
                  {col.map((story) => (
                    <StoryCard key={story.id} story={story} />
                  ))}
                  {col.length === 0 && (
                    <div
                      onClick={() => openCreate(status)}
                      className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/8 py-6 text-xs text-white/25 transition-colors hover:border-white/20 hover:text-white/40"
                    >
                      No stories
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <StoryModal story={null} defaultStatus={defaultStatus} onClose={() => setShowModal(false)} onSave={handleSave} />
      )}

      {showEdit && (
        <ProjectEditModal project={localProject} onClose={() => setShowEdit(false)} onSave={handleEditSave} />
      )}

      {showSwitcher && (
        <ProjectModal currentProjectId={localProject.id} onClose={() => setShowSwitcher(false)} />
      )}
    </>
  );
};

export default StoryBoard;
