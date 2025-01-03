'use client';

import { useRouter } from 'next/navigation';
import { ProjectList } from '@/components/project/project-list';
import { initialEdges, initialNodes, useProjects } from '@/hooks';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import Image from 'next/image';
import { TemplateList } from '@/components/project/template-list';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

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
    router.push(`/projects/${project.id}/flow`);
  };
  return (
    <div className="flex flex-col w-full gap-2">
      <title>Projects | Agentok Studio</title>
      <div className="flex flex-col items-center justify-center gap-4 text-sm p-2">
        <Logo className="w-24 h-24 text-brand mt-8" />
        <span className="text-5xl font-bold font-arial p-4">My Projects</span>
        <span className="text-lg p-4">Create and manage your AI agent projects</span>
        <ProjectList />
        <Button className="btn btn-primary" onClick={onCreateProject}>
          <Icons.swap3 className="w-7 h-7" />
          Create New Project
        </Button>
      </div>
      <div className="divider text-2xl">Or</div>
      <div className="flex flex-col items-center justify-center gap-2 text-sm py-8 mb-12">
        <Icons.shoppingBag className="w-16 h-16 text-primary" />
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
};
