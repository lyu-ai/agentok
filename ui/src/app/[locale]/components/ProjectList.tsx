'use client';
import { useTranslations } from 'next-intl';
import { BsInboxes } from 'react-icons/bs';
import { GoRepoForked, GoTrash } from 'react-icons/go';
import { useChats, useProjects, useTemplates } from '@/hooks';
import clsx from 'clsx';
import pb, { getAvatarUrl } from '@/utils/pocketbase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { PiChatCircleDotsBold } from 'react-icons/pi';
import Markdown from '@/components/Markdown';

export const ProjectEmpty = () => {
  const t = useTranslations('component.TemplateList');
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col gap-2 items-center text-base-content/60">
        <BsInboxes className="w-12 h-12" />
        <div className="mt-2 text-sm">{t('template-empty')}</div>
      </div>
    </div>
  );
};

export const ProjectLoading = () => {
  return (
    <div className="flex w-full flex-wrap justify-center gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="card w-80 h-96 flex flex-col bg-base-content/10 overflow-hidden gap-3"
        >
          <div className="skeleton w-full h-48 rounded-none shrink-0" />
          <div className="card-body">
            <div className="flex items-center gap-2 p-3 ">
              <div className="skeleton w-6 h-6 rounded-full shrink-0 " />
              <div className="skeleton h-4 w-1/2" />
            </div>
            <div className="skeleton h-3 w-full p-3 " />
            <div className="skeleton h-3 w-1/2 p-3 " />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ProjectBlock = ({ project, index, className }: any) => {
  const t = useTranslations('component.TemplateList');
  const { deleteProject, isDeleting } = useProjects();
  const { createChat, isCreating } = useChats();
  const router = useRouter();
  const onDelete = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    deleteProject(project.id);
  };
  const onChat = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    await createChat(project.id, 'project')
      .then(chat => {
        if (chat) {
          router.push(`/chats/${chat.id}`);
        }
      })
      .catch(e => {
        console.log(e);
        toast.error(`Failed to create chat: ${e}`);
      });
  };
  return (
    <Link
      className={clsx(
        'group card w-80 bg-base-content/10 border border-base-content/10',
        className,
        'hover:shadow-box hover:shadow-primary/40 hover:border-primary/40'
      )}
      href={`/projects/${project.id}/flow`}
    >
      <div className="card-body p-4 gap-2 font-normal">
        <h2 className="card-title  group-hover:text-primary line-clamp-1">
          {project.name}
        </h2>
        <div className="text-xs text-base-content/40">
          {new Date(project.created).toLocaleString()}
        </div>
        <Markdown className="text-left text-sm h-20 break-word word-wrap line-clamp-2">
          {project.description}
        </Markdown>
        <div className="relative card-actions justify-end gap-1 text-xs text-base-content/60">
          <button
            className="btn btn-xs rounded btn-outline group-hover:bg-primary group-hover:text-primary-content gap-1 group-hover:animate-pulse"
            onClick={onChat}
            data-tooltip-id="default-tooltip"
            data-tooltip-content={t('start-chat-tooltip')}
          >
            <PiChatCircleDotsBold
              className={clsx('w-4 h-4', {
                'animate-spin': isCreating,
              })}
            />
            {t('start-chat')}
          </button>
        </div>
      </div>
    </Link>
  );
};

const ProjectList = ({ maxCount }: any) => {
  const { projects, isLoading, isError } = useProjects();
  const t = useTranslations('component.TemplateList');

  if (isError) {
    console.warn('Failed to load template');
  }
  if (isLoading) return <ProjectLoading />;
  if (!projects || projects.length === 0) return <ProjectEmpty />;

  return (
    <div className="flex flex-wrap justify-center gap-4 p-2">
      {projects.map((project: any, index: number) => (
        <ProjectBlock key={project.id} project={project} index={index} />
      ))}
    </div>
  );
};

export default ProjectList;
