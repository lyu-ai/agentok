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
import { ScrollArea } from '../ui/scroll-area';

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Link href="/projects" className="flex items-center gap-1 text-sm font-medium">
          {activeProject?.name || 'Projects'}
          <Icons.chevronsUpDown className="w-3 h-3" />
        </Link>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={14} className="flex flex-col w-[480px] p-0 h-[calc(100vh-var(--header-height)-2rem)]">
        <div className="flex items-center gap-2 border-b w-full p-1">
          <Link href="/projects">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Icons.home className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCreateProject}
            disabled={isCreating}
            className="h-7 w-7"
          >
            {!isCreating && <Icons.add className="h-4 w-4" />}
            {isCreating && <Icons.spinner className="animate-spin h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 gap-1 p-2 pl-1">
            {projects.length > 0 &&
              projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onSelect={() => router.push(`/projects/${project.id}/flow`)}
                  className="flex w-full"
                >
                  <div className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/5 overflow-hidden">
                    <Icons.project className="h-5 w-5 shrink-0" />
                    <span className="flex flex-col">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-xs text-muted-foreground line-clamp-2">
                        {project.description}
                      </span>
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};