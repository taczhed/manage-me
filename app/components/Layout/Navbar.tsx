'use client';

import Link from 'next/link';
import { User, Project, Story, Task } from '../../actions/types';
import { currentUser } from '../../actions/users';

type Props = {
  user?: User;
  project?: Project;
  story?: Story;
  task?: Task;
};

const Navbar = ({ user = currentUser, project, story, task }: Props) => {
  return (
    <nav className="flex items-center justify-between border-b border-white/6 px-6 py-4">
      <div className="flex items-center gap-1.5 text-[15px] font-bold tracking-tight">
        <Link href="/" className="font-display text-foreground hover:text-foreground/80 transition-colors">
          manage.me
        </Link>
        {project && (
          <>
            <span className="text-white/20">/</span>
            <Link
              href={`/projects/${project.id}`}
              className="text-foreground-hover hover:text-foreground max-w-[140px] truncate transition-colors"
            >
              {project.name}
            </Link>
          </>
        )}
        {story && (
          <>
            <span className="text-white/20">/</span>
            {task ? (
              <Link
                href={`/stories/${story.id}`}
                className="text-foreground-hover hover:text-foreground max-w-[140px] truncate transition-colors"
              >
                {story.name}
              </Link>
            ) : (
              <span className="text-foreground max-w-[140px] truncate">{story.name}</span>
            )}
          </>
        )}
        {task && (
          <>
            <span className="text-white/20">/</span>
            <span className="text-foreground max-w-[140px] truncate">{task.name}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
        <div className="bg-primary/30 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white">
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <span className="text-foreground-hover text-sm">
          {user.firstName} {user.lastName}
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
