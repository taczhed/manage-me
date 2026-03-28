'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveProjectId } from './actions/projects';
import Navbar from './components/Layout/Navbar';
import ProjectModal from './components/Project/ProjectModal';

export default function Home() {
  const router = useRouter();
  const [activeId] = useState(() => getActiveProjectId());

  useEffect(() => {
    if (activeId) router.push('/projects/' + activeId);
  }, [activeId, router]);

  if (activeId) return null;

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary/[0.08] absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>
      <div className="relative z-10">
        <Navbar />
        <ProjectModal onClose={() => {}} />
      </div>
    </div>
  );
}
