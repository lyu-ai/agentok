'use client';
import { useChats, useProjects } from '@/hooks';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Markdown } from '@/components/markdown';
import { ProjectPublish } from './project-publish';
import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export const ProjectLoading = () => {
  return (
    <div className="flex w-full flex-wrap justify-center gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="w-80 h-48 flex flex-col overflow-hidden gap-2">
          <div className="p-4 flex flex-col gap-2">
            <Skeleton className="h-8 w-full" />
            <div className="flex flex-col gap-2 h-full">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex items-center justify-end gap-1">
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export const ProjectBlock = ({ project, className }: any) => {
  const { createChat, isCreating } = useChats();
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const router = useRouter();
  const { deleteProject, isDeleting } = useProjects();
  const onChat = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    await createChat(project.id, 'project')
      .then((chat) => {
        if (chat) {
          router.push(`/chats/${chat.id}`);
        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          title: 'Error',
          description: `Failed to create chat: ${e}`,
          variant: 'destructive',
        });
      });
  };
  const onDelete = async () => {
    try {
      await deleteProject(project.id);
      toast({ title: `Project ${project.name} deleted` });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };
  return (
    <Card
      className={cn(
        'relative group w-80 hover:border-primary/40 p-4 flex flex-col gap-2',
        className
      )}
    >
      <h2 className="line-clamp-1 text-primary text-lg font-bold">
        {project.name}
      </h2>
      <div className="text-xs text-muted-foreground">
        {new Date(project.updated_at).toLocaleString()}
      </div>
      <Markdown className="text-left text-sm h-20 text-muted-foreground break-word word-wrap line-clamp-4">
        {project.description}
      </Markdown>
      <div className="relative card-actions flex justify-between gap-1 text-xs text-base-content/60">
        <Button
          className="flex items-center gap-1"
          size="icon"
          variant="ghost"
          onClick={onChat}
        >
          <Icons.chat
            className={cn('w-4 h-4', {
              'animate-spin': isCreating,
            })}
          />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowPublishDialog((v) => !v)}
          >
            <Icons.share className={cn('w-4 h-4')} />
          </Button>
          <Link
            href={`/projects/${project.id}`}
            className="flex items-center gap-1"
          >
            <Button size="icon" variant="ghost">
              <Icons.edit className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="hidden absolute top-2 right-2 group-hover:block">
        <Button size="icon" variant="ghost" onClick={onDelete}>
          {isDeleting ? (
            <Icons.spinner className="w-4 h-4 animate-spin text-red-500" />
          ) : (
            <Icons.trash className="w-4 h-4 text-red-500" />
          )}
        </Button>
      </div>
      {showPublishDialog && (
        <ProjectPublish
          show={showPublishDialog}
          projectId={project.id}
          onClose={() => setShowPublishDialog(false)}
        />
      )}
    </Card>
  );
};

export const ProjectList = ({ maxCount }: any) => {
  const { projects, isLoading, isError } = useProjects();

  if (isError) {
    console.warn('Failed to load template');
  }
  if (isLoading) return <ProjectLoading />;
  if (!projects || projects.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-4 p-2">
      {projects.map((project: any, index: number) => (
        <ProjectBlock key={project.id} project={project} index={index} />
      ))}
    </div>
  );
};
