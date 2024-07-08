'use client';

import { useRouter } from 'next/navigation';
import ProjectList from '../components/ProjectList';
import { useProjects } from '@/hooks/useProjects';
import { toast } from 'react-toastify';

const Page = () => {
  const router = useRouter();
  const { createProject } = useProjects();
  const onCreateProject = async () => {
    const project = await createProject();
    if (!project) {
      toast.error('Failed to create project');
      return;
    }
    toast.success('Project created. Now jumping to project page.');
    router.push(`/projects/${project.id}`);
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
