'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Project, Story } from '../../actions/types';
import { currentUser } from '../../actions/users';
import ProjectModal from '../Project/ProjectModal';

type Props = {
  user?: User;
  project?: Project;
  story?: Story;
  onProjectUpdated?: (project: Project) => void;
};

const Navbar = ({ user = currentUser, project, story, onProjectUpdated }: Props) => {
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [localProject, setLocalProject] = useState<Project | undefined>(project);

  const handleProjectUpdated = (p: Project) => {
    setLocalProject(p);
    onProjectUpdated?.(p);
  };

  const displayProject = localProject || project;

  return (
    <>
      <nav className="flex items-center justify-between border-b border-white/6 px-6 py-4">
        <div className="flex items-center gap-1.5 text-[15px] font-bold tracking-tight">
          <Link href="/" className="font-display text-foreground hover:text-foreground/80 transition-colors">
            manage.me
          </Link>
          {displayProject && (
            <>
              <span className="text-white/20">/</span>
              {story ? (
                <Link
                  href={`/projects/${displayProject.id}`}
                  className="text-foreground-hover hover:text-foreground max-w-[140px] truncate transition-colors"
                >
                  {displayProject.name}
                </Link>
              ) : (
                <button
                  onClick={() => setShowSwitcher(true)}
                  className="text-foreground hover:text-foreground/80 max-w-[140px] truncate transition-colors"
                >
                  {displayProject.name}
                </button>
              )}
            </>
          )}
          {story && (
            <>
              <span className="text-white/20">/</span>
              <span className="text-foreground max-w-[140px] truncate">{story.name}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {displayProject && (
            <button
              onClick={() => setShowSwitcher(true)}
              className="bg-secondary text-foreground-hover hover:text-foreground hover:bg-secondary-hover flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-1.5 text-sm transition-all"
            >
              Change project
            </button>
          )}

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
            <div className="bg-primary/30 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <span className="text-foreground-hover text-sm">
              {user.firstName} {user.lastName}
            </span>
          </div>
        </div>
      </nav>

      {showSwitcher && (
        <ProjectModal
          currentProjectId={displayProject?.id}
          onClose={() => setShowSwitcher(false)}
          onProjectUpdated={handleProjectUpdated}
        />
      )}
    </>
  );
};

export default Navbar;
