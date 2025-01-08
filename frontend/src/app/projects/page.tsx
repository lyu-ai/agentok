'use client';

import { useRouter } from 'next/navigation';
import { ProjectList } from '@/components/project/project-list';
import { initialEdges, initialNodes, useProjects } from '@/hooks';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { TemplateList } from '@/components/project/template-list';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Page() {
  const router = useRouter();
  const { createProject, setActiveProjectId } = useProjects();
  useEffect(() => {
    setActiveProjectId(-1);
  }, []);
  const onCreateProject = async () => {
    const project = await createProject({
      id: -1, // Will be replaced by actual id from server side
      name: 'New Project',
      description: 'A new project with sample flow.',
      flow: {
        nodes: initialNodes,
        edges: initialEdges,
      },
    });
    if (!project) {
      toast({ title: 'Failed to create project' });
      return;
    }
    toast({ title: 'Project created. Now jumping to project page.' });
    router.push(`/projects/${project.id}`);
  };
  return (
    <div className="flex flex-col w-full gap-2">
      <title>Projects | Agentok Studio</title>
      <div className="flex flex-col items-center justify-center gap-4 text-sm p-2">
        <span className="text-4xl font-bold font-arial p-4">
          Build Agentic Apps
        </span>
        <span className="text-lg">
          Create and manage your AI agent projects with Agentok Studio.
        </span>
        <Button size="lg" onClick={onCreateProject}>
          <Icons.project />
          Create New Project
        </Button>
        <ProjectList />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 text-sm py-8 mb-12">
        <div className="divider text-2xl text-center">Or</div>
        <span className="text-2xl p-4">Start from a Template</span>
        <TemplateList maxCount={3} />
        <Link
          href="/discover"
          className="btn btn-primary btn-lg btn-outline text-lg mt-8"
        >
          Discover More Templates
        </Link>
      </div>
    </div>
  );
}
