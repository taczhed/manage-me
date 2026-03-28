'use client';

import { useState } from 'react';
import { Project, User, StoryStatus } from '../../actions/types';
import { getStories, createStory } from '../../actions/stories';
import StoryModal, { StoryFormData } from './StoryModal';
import StoryCard from './StoryCard';

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
  const [stories, setStories] = useState(() => getStories(project.id));
  const [showModal, setShowModal] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<StoryStatus>('todo');

  const refresh = () => setStories(getStories(project.id));

  const handleSave = (data: StoryFormData, _id?: string) => {
    createStory({ ...data, projectId: project.id, ownerId: user.id });
    refresh();
    setShowModal(false);
  };

  const openCreate = (status: StoryStatus) => {
    setDefaultStatus(status);
    setShowModal(true);
  };

  return (
    <>
      <div className="mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-foreground text-xl font-bold tracking-tight">{project.name}</h2>
          {project.description && <p className="text-foreground-hover mt-1 text-sm">{project.description}</p>}
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
        <StoryModal
          story={null}
          defaultStatus={defaultStatus}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default StoryBoard;
