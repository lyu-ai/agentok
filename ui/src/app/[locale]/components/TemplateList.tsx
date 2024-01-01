import { useTranslations } from 'next-intl';
import { BsInboxes } from 'react-icons/bs';
import { GoRepoForked, GoTrash } from 'react-icons/go';
import { useChats, useFlows, useTemplates } from '@/hooks';
import clsx from 'clsx';
import pb, { getAvatarUrl } from '@/utils/pocketbase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { PiChatCircleDotsBold } from 'react-icons/pi';
import Markdown from '@/components/Markdown';

export const TemplateEmpty = () => {
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

export const TemplateBlock = ({
  template,
  index,
  className,
  suppressLink,
}: any) => {
  const [isOwned, setIsOwned] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const t = useTranslations('component.TemplateList');
  const { deleteTemplate, isDeleting } = useTemplates();
  const { forkFlow, isForking } = useFlows();
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
    templateDescription = t('default-description', {
      node_count: template.flow.nodes.length,
      edge_count: template.flow?.edges?.length ?? 0,
    });
  }
  useEffect(() => {
    setIsAuthed(!!pb.authStore.model);
    setIsOwned(template.owner === pb.authStore.model?.id);
  }, [template]);
  const onDelete = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    deleteTemplate(template.id);
  };
  const onFork = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    const forkedFlow = await forkFlow(template);
    if (forkedFlow) {
      router.push(`/flow/${forkedFlow.id}`);
    }
  };
  const onChat = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    await createChat(template.id, 'template')
      .then(chat => {
        if (chat) {
          router.push(`/chat/${chat.id}`);
        }
      })
      .catch(e => {
        console.log(e);
        toast.error(`Failed to create chat: ${e}`);
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
      return <div className={className}>{children}</div>;
    } else {
      return (
        <Link href={`/gallery/${template.id}`} className={className}>
          {children}
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
          'hover:shadow-box hover:shadow-primary/40 hover:border-primary/40': !suppressLink,
        }
      )}
    >
      <figure>
        <img
          src={
            template.thumbnail ??
            `https://docs.flowgen.app/img/${randomImage}.png`
          }
          alt={template.name}
          className="rounded-t-md h-48 w-full object-cover"
        />
      </figure>
      <div className="card-body p-4 gap-2 font-normal">
        <h2 className="card-title  group-hover:text-primary line-clamp-1">
          {template.name}
        </h2>
        <div className="flex gap-2 items-center text-xs text-base-content/60">
          {template.expand?.owner?.avatar && (
            <img
              src={getAvatarUrl(template.expand?.owner)}
              height={16}
              width={16}
              alt="owner"
              className="w-4 h-4 rounded-full"
            />
          )}
          {template.expand?.owner?.name ?? template.expand?.owner?.email ?? ''}
        </div>
        <div className="text-xs text-base-content/60">
          {new Date(template.created).toLocaleString()}
        </div>
        <Markdown
          suppressLink={!suppressLink}
          className="text-left text-sm h-20 break-word word-wrap line-clamp-2"
        >
          {templateDescription}
        </Markdown>
        {isAuthed && (
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
            <button
              className="btn btn-xs btn-outline rounded group-hover:btn-primary gap-1"
              onClick={onFork}
              data-tooltip-id="default-tooltip"
              data-tooltip-content={t('fork-tooltip')}
            >
              <GoRepoForked
                className={clsx('w-4 h-4', { 'animate-spin': isForking })}
              />
              {t('fork')}
            </button>
            {isOwned && (
              <button
                className="absolute left-0 btn btn-xs btn-ghost btn-square group-hover:text-red-400"
                data-tooltip-id="default-tooltip"
                data-tooltip-content={t('unpublish-tooltip')}
                onClick={onDelete}
              >
                <GoTrash
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

const TemplateList = ({ maxCount }: any) => {
  const { templates, isLoading, isError } = useTemplates();
  const t = useTranslations('component.TemplateList');

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
        <TemplateBlock key={template.id} template={template} index={index} />
      ))}
    </div>
  );
};

export default TemplateList;
