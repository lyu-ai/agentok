import { useChats, useProjects, useTemplates } from '@/hooks';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import Markdown from '@/components/markdown';
import { useUser } from '@/hooks/use-user';
import { Icons } from '../icons';
import { Card } from '../ui/card';

export const TemplateEmpty = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col gap-2 items-center text-base-content/60">
        <Icons.inbox className="w-12 h-12" />
        <div className="mt-2 text-sm">No templates found</div>
      </div>
    </div>
  );
};

export const TemplateLoading = () => {
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

export const TemplateCard = ({
  template,
  index,
  className,
  suppressLink,
}: any) => {
  const { userId } = useUser();
  const [isOwned, setIsOwned] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const { deleteTemplate, isDeleting } = useTemplates();
  const { forkProject, isForking } = useProjects();
  const { createChat, isCreating } = useChats();
  const router = useRouter();
  const config = template.flow?.nodes?.find(
    (node: any) => node.type === 'config'
  );
  let templateDescription = '';
  if (template.description) {
    templateDescription = template.description;
  } else if (config?.data?.flow_description) {
    templateDescription = config.data.flow_description;
  } else {
    templateDescription = `Default description, ${template.flow.nodes.length} nodes, ${template.flow?.edges?.length ?? 0} edges`;
  }
  useEffect(() => {
    setIsAuthed(userId !== null);
    setIsOwned(template.user_id === userId);
  }, [template, userId]);
  const handleDelete = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    deleteTemplate(template.id);
  };
  const handleFork = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    const forkedProject = await forkProject(template);
    if (forkedProject) {
      router.push(`/projects/${forkedProject.id}/flow`);
    }
  };
  const handleChat = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    await createChat(template.id, 'template')
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
  const randomImage = [
    'api',
    'knowledge',
    'rag',
    'flow',
    'random-1',
    'random-2',
    'random-3',
    'random-4',
    'random-5',
    'random-6',
    'random-7',
    'random-8',
  ][index % 12];
  const ConditionalLink = ({ children, className }: any) => {
    if (suppressLink) {
      return <Card className={className}>{children}</Card>;
    } else {
      return (
        <Link href={`/discover/${template.id}`}>
          <Card className={className}>
            {children}
          </Card>
        </Link>
      );
    }
  };
  return (
    <ConditionalLink
      className={clsx(
        'group card w-80 bg-base-content/10 border border-base-content/10',
        className,
        {
          'hover:shadow-box hover:shadow-base-content/20 hover:border-base-content/20':
            !suppressLink,
        }
      )}
    >
      <figure>
        <img
          src={
            template.thumbnail ?? `https://agentok.ai/img/${randomImage}.png`
          }
          alt={template.name}
          className="rounded-t-md h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body p-4 gap-2 font-normal h-64">
        <h2 className="card-title  group-hover:text-primary line-clamp-1">
          {template.name}
        </h2>
        <div className="flex gap-2 h-8 items-center text-xs text-base-content/60">
          {template.avatar_url ? (
            <img
              src={template.avatar_url ?? '/logo-spaced.png'}
              height={24}
              width={24}
              alt="owner"
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full shrink-0 bg-base-content/20 flex items-center justify-center">
              <Icons.heart className="w-4 h-4 text-base-content" />
            </div>
          )}
          {template.full_name ?? template.email ?? ''}
        </div>
        <div className="text-xs text-base-content/40">
          {new Date(template.created_at).toLocaleString()}
        </div>
        <Markdown
          suppressLink={!suppressLink}
          className="text-left text-sm h-20 break-word word-wrap line-clamp-4 flex-1"
        >
          {templateDescription}
        </Markdown>
        {isAuthed && (
          <div className="relative card-actions justify-end gap-2 text-xs text-base-content/60">
            <button
              className="btn btn-xs btn-ghost gap-1"
              onClick={handleChat}
              data-tooltip-id="default-tooltip"
              data-tooltip-content="Start chat"
            >
              <Icons.robot
                className={clsx('w-4 h-4', {
                  'animate-spin': isCreating,
                })}
              />
              Start chat
            </button>
            <button
              className="btn btn-xs btn-ghost gap-1"
              onClick={handleFork}
              data-tooltip-id="default-tooltip"
              data-tooltip-content="Fork"
            >
              <Icons.gitFork
                className={clsx('w-4 h-4', { 'animate-spin': isForking })}
              />
              Fork
            </button>
            {isOwned && (
              <button
                className="absolute left-0 btn btn-xs btn-ghost btn-square group-hover:text-red-400"
                data-tooltip-id="default-tooltip"
                data-tooltip-content="Unpublish"
                onClick={handleDelete}
              >
                <Icons.trash
                  className={clsx('w-4 h-4', {
                    'loading loading-xs': isDeleting,
                  })}
                />
              </button>
            )}
          </div>
        )}
      </div>
    </ConditionalLink>
  );
};

export const TemplateList = ({ maxCount }: any) => {
  const { templates, isLoading, isError } = useTemplates();

  if (isError) {
    console.warn('Failed to load template');
  }
  if (isLoading) return <TemplateLoading />;
  if (!templates || templates.length === 0) return <TemplateEmpty />;

  const slicedTemplates =
    maxCount > 0 ? templates.slice(0, maxCount) : templates;
  return (
    <div className="flex flex-wrap justify-center gap-4 p-2">
      {slicedTemplates.map((template: any, index: number) => (
        <TemplateCard key={template.id} template={template} index={index} />
      ))}
    </div>
  );
};
