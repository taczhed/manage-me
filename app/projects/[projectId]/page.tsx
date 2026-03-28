'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getProject, setActiveProjectId } from '../../actions/projects';
import { currentUser } from '../../actions/users';
import Navbar from '../../components/Layout/Navbar';
import StoryBoard from '../../components/Story/StoryBoard';

type Props = { params: Promise<{ projectId: string }> };

export default function ProjectPage({ params }: Props) {
  const { projectId } = use(params);
  const [project, setProject] = useState(() => getProject(projectId) || null);

  const router = useRouter();

  useEffect(() => {
    if (!project) {
      router.push('/');
      return;
    }
    setActiveProjectId(projectId);
  }, [project, projectId, router]);

  if (!project) return null;

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary/[0.08] absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>
      <div className="relative z-10">
        <Navbar project={project} />
        <main>
          <StoryBoard project={project} user={currentUser} />
        </main>
      </div>
    </div>
  );
}
