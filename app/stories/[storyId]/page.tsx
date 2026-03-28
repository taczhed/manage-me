'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Story, Project } from '../../actions/types';
import { getStory } from '../../actions/stories';
import { getProject } from '../../actions/projects';
import Navbar from '../../components/Layout/Navbar';
import TaskBoard from '../../components/Task/TaskBoard';

type Props = { params: Promise<{ storyId: string }> };

export default function StoryPage({ params }: Props) {
  const { storyId } = use(params);
  const [story] = useState<Story | null>(() => getStory(storyId) || null);
  const [project] = useState<Project | null>(() => {
    const s = getStory(storyId);
    return s ? getProject(s.projectId) || null : null;
  });

  const router = useRouter();

  useEffect(() => {
    if (!story) router.push('/');
  }, [story, router]);

  if (!story) return null;

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary/[0.08] absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>
      <div className="relative z-10">
        <Navbar project={project || undefined} story={story} />
        <main>
          <TaskBoard story={story} />
        </main>
      </div>
    </div>
  );
}
