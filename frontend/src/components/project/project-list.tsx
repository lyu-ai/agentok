'use client';
import { useChats, useProjects } from '@/hooks';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import Markdown from '@/components/markdown';
import { ProjectPublish } from './project-publish';
import { useState } from 'react';
import { Icons } from '@/components/icons';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

export const ProjectLoading = () => {
  return (
    <div className="flex w-full flex-wrap justify-center gap-4">
      {[...Array(4)].map((_, i) => (
        <Card
          key={i}
          className="card w-80 h-48 flex flex-col overflow-hidden gap-2 bg-base-content/10 border border-base-content/10"
        >
          <div className="card-body p-4 gap-2">
            <div className="skeleton h-8 w-full" />
            <div className="flex flex-col gap-2 h-full">
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-4 w-1/2" />
            </div>
            <div className="flex items-center justify-end gap-1 text-xs text-base-content/60">
              <div className="skeleton h-5 w-20 p-2"></div>
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

  const onChat = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    await createChat(project.id, 'project')
      .then((chat) => {
        if (chat) {
          router.push(`/chat?id=${chat.id}`);
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
  return (
    <Card
      className={clsx(
        'group card w-80 bg-base-content/10 border border-base-content/10',
        className,
        'hover:shadow-box hover:border-primary/40'
      )}
    >
      <div className="card-body p-4 gap-2 font-normal">
        <h2 className="card-title  group-hover:text-primary line-clamp-1">
          {project.name}
        </h2>
        <div className="text-xs text-base-content/40">
          {new Date(project.created_at).toLocaleString()}
        </div>
        <Markdown className="text-left text-sm h-20 break-word word-wrap line-clamp-4">
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
              className={clsx('w-4 h-4', {
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
              <Icons.share className={clsx('w-4 h-4')} />
            </Button>
            <Link
              href={`/projects/${project.id}/flow`}
              className="flex items-center gap-1"
            >
              <Button size="icon" variant="ghost">
                <Icons.edit className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
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
