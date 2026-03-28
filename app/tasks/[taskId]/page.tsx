'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task, Story, Project } from '../../actions/types';
import { getTask } from '../../actions/tasks';
import { getStory } from '../../actions/stories';
import { getProject } from '../../actions/projects';
import { users } from '../../actions/users';
import Navbar from '../../components/Layout/Navbar';
import TaskDetail from '../../components/Task/TaskDetail';

type Props = { params: Promise<{ taskId: string }> };

export default function TaskPage({ params }: Props) {
  const { taskId } = use(params);

  const [project] = useState<Project | null>(() => {
    const t = getTask(taskId);
    if (!t) return null;
    const s = getStory(t.storyId);
    return s ? getProject(s.projectId) || null : null;
  });
  const [story, setStory] = useState<Story | null>(() => {
    const t = getTask(taskId);
    return t ? getStory(t.storyId) || null : null;
  });
  const [task, setTask] = useState<Task | null>(() => getTask(taskId) || null);

  const router = useRouter();

  useEffect(() => {
    if (!task) router.push('/');
  }, [task, router]);

  const refresh = () => {
    const updated = getTask(taskId) || null;
    setTask(updated);
    if (updated) setStory(getStory(updated.storyId) || null);
  };

  if (!task) return null;

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary/[0.08] absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>
      <div className="relative z-10">
        <Navbar project={project || undefined} story={story || undefined} />
        <main>
          <TaskDetail
            task={task}
            story={story}
            users={users}
            onRefresh={refresh}
            onDelete={() => router.push(story ? `/stories/${story.id}` : '/')}
          />
        </main>
      </div>
    </div>
  );
}
