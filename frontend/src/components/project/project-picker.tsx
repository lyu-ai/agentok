'use client';
import { initialEdges, initialNodes, useProjects } from '@/hooks';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const ProjectPicker = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    projects,
    createProject,
    isCreating,
    updateProject,
    activeProjectId,
    getProjectById,
  } = useProjects();
  const isActive = pathname.startsWith('/projects');

  const onCreateProject = async () => {
    const newProject = await createProject({
      id: -1, // Will be replaced by actual id from server side
      name: 'New Project',
      description: 'A new project with sample flow.',
      flow: {
        nodes: initialNodes,
        edges: initialEdges,
      },
    });
    if (!newProject) {
      toast({ title: 'Failed to create project' });
      return;
    }

    toast({ title: 'Project created. Now jumping to project page.' });
    router.push(`/projects/${newProject.id}/flow`);
  };

  const activeProject = getProjectById(activeProjectId);

  return (
    <div className={cn('flex items-center gap-2')}>
      <Link
        href={
          activeProject ? `/projects/${activeProject?.id}/flow` : '/projects'
        }
        className="flex items-center gap-1.5 text-sm"
      >
        <Icons.project className="h-4 w-4 group-hover:scale-125 transform transition duration-700 ease-in-out" />
        <span className="text-ellipsis overflow-hidden whitespace-nowrap max-w-24">
          {activeProject?.name || 'Projects'}
        </span>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Icons.chevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-48">
          <div className="flex items-center gap-2 border-b p-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/projects">
                <Icons.list className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onCreateProject}
              disabled={isCreating}
            >
              {!isCreating ? <Icons.add className="h-4 w-4" /> : null}
              {isCreating && <div className="animate-spin">...</div>}
            </Button>
          </div>
          {projects.length > 0 &&
            projects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onSelect={() => router.push(`/projects/${project.id}/flow`)}
                className="flex items-center gap-2 text-sm"
              >
                <Icons.project className="h-4 w-4" />
                {project.name}
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
