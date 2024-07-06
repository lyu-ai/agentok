'use client';

import ProjectList from '../components/ProjectList';
import { useProjects } from '@/hooks/useProjects';

const Page = () => {
  const { createProject } = useProjects();
  const onCreateProject = async () => {
    const project = await createProject();
    console.log('project', project);
  };
  return (
    <div className="flex flex-col w-full gap-2">
      <div className="flex items-center justify-end">
        <button onClick={onCreateProject} className="btn btn-primary">
          Create Project
        </button>
      </div>
      <ProjectList />
    </div>
  );
};

export default Page;
