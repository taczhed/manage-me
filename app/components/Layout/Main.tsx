'use client';

import { useState } from 'react';
import { Project } from '../../actions/types';
import { currentUser } from '../../actions/users';
import {
  getProjects,
  createProject,
  updateProject,
  removeProject,
  getActiveProject,
  setActiveProjectId,
} from '../../actions/projects';
import { removeStory, getStories } from '../../actions/stories';
import Navbar from './Navbar';
import ProjectSelector from '../Project/ProjectSelector';
import StoryBoard from '../Story/StoryBoard';

const Main = () => {
  const [projects, setProjects] = useState(() => getProjects());
  const [activeProject, setActiveProject] = useState(() => getActiveProject());

  const refreshProjects = () => setProjects(getProjects());

  const handleSelectProject = (project: Project) => {
    setActiveProjectId(project.id);
    setActiveProject(project);
  };

  const handleChangeProject = () => {
    setActiveProjectId(null);
    setActiveProject(null);
    refreshProjects();
  };

  const handleCreateProject = (name: string, description: string) => {
    const project = createProject({ name, description });
    refreshProjects();
    handleSelectProject(project);
  };

  const handleEditProject = (id: string, name: string, description: string) => {
    updateProject(id, { name, description });
    refreshProjects();
    if (activeProject?.id === id) {
      setActiveProject((p) => (p ? { ...p, name, description } : p));
    }
  };

  const handleDeleteProject = (id: string) => {
    const stories = getStories(id);
    stories.forEach((s) => removeStory(s.id));
    removeProject(id);
    refreshProjects();
    if (activeProject?.id === id) {
      setActiveProject(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="bg-primary/[0.08] absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-blue-500/[0.06] blur-3xl" />
      </div>

      <div className="relative z-10">
        <Navbar user={currentUser} activeProject={activeProject} onChangeProject={handleChangeProject} />
        <main>
          {activeProject ? (
            <StoryBoard key={activeProject.id} project={activeProject} user={currentUser} />
          ) : (
            <ProjectSelector
              projects={projects}
              onSelect={handleSelectProject}
              onCreate={handleCreateProject}
              onDelete={handleDeleteProject}
              onEdit={handleEditProject}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Main;
