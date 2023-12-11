import { useTranslations } from 'next-intl';
import { BsInboxes } from 'react-icons/bs';
import { GoRepoForked, GoTrash } from 'react-icons/go';
import { FcOrgUnit } from 'react-icons/fc';
import { useFlows, usePublicFlows } from '@/hooks';
import clsx from 'clsx';
import { createClient } from '@/utils/supabase/client';
import { RiChatSmile2Line } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export const FlowEmpty = () => {
  const t = useTranslations('component.PublicFlowList');
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col gap-2 items-center text-base-content/60">
        <BsInboxes className="w-12 h-12" />
        <div className="mt-2 text-sm">{t('flow-empty')}</div>
        {/* <div className="btn btn-sm btn-primary" onClick={onReset}>
          {t('new-flow')}
        </div> */}
      </div>
    </div>
  );
};

export const FlowLoading = () => {
  return (
    <div className="flex flex-col w-full h-full p-2">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="group relative flex flex-col bg-base-content/10 rounded-md p-3 gap-3"
          >
            <div className="flex items-center gap-2">
              <div className="skeleton w-6 h-6 rounded-full shrink-0" />
              <div className="skeleton h-4 w-1/2" />
            </div>
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
};

const FlowBlock = ({ action, flow }: any) => {
  const [isOwned, setIsOwned] = useState(false);
  const supabase = createClient();
  const t = useTranslations('component.PublicFlowList');
  const { deleteFlow, isDeleting } = usePublicFlows();
  const { forkFlow, isForking } = useFlows();
  const router = useRouter();
  const config = flow.flow.nodes.find((node: any) => node.type === 'config');
  let flowDescription = '';
  if (flow.description) {
    flowDescription = flow.description;
  } else if (config?.data?.flow_description) {
    flowDescription = config.data.flow_description;
  } else {
    flowDescription = t('default-description', {
      node_count: flow.flow.nodes.length,
      edge_count: flow.flow?.edges?.length ?? 0,
    });
  }
  useEffect(() => {
    supabase.auth
      .getUserIdentities()
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
          return;
        }
        const ownedByCurrentUser = flow.user_id === data.identities[0]?.user_id;
        setIsOwned(ownedByCurrentUser);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  const onDelete = (e: any) => {
    deleteFlow(flow.id);
    e.stopPropagation();
    e.preventDefault();
  };
  const onFork = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    const newFlow = await forkFlow(flow);
    if (newFlow) {
      router.push(`/flow/${newFlow.id}`);
    }
  };
  const onChat = (e: any) => {
    // TODO: Create new chat session and redirect to chat page
    e.stopPropagation();
    e.preventDefault();
  };
  return (
    <div className="group relative flex flex-col bg-base-content/10 rounded-md p-3 gap-3">
      <div className="flex items-center gap-2 group-hover:text-primary">
        <FcOrgUnit className="w-12 h-12" />
        <h2 className="font-bold">{flow.name}</h2>
      </div>
      <div className="divider my-0" />
      <div className="flex flex-col h-full justify-between gap-2">
        <div className="text-left text-sm">{flowDescription}</div>
        <div className="flex items-center justify-between bottom-2">
          <div className="text-xs text-base-content/60">
            {new Date(flow.created_at).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="flex w-full justify-end gap-1 text-xs text-base-content/60">
        <button className="btn btn-sm btn-outline" onClick={onChat}>
          <RiChatSmile2Line
            className={clsx('w-4 h-4', { 'loading loading-xs': isDeleting })}
          />
          Chat
        </button>
        <button className="btn btn-sm btn-outline" onClick={onFork}>
          <GoRepoForked
            className={clsx('w-4 h-4', { 'loading loading-xs': isForking })}
          />
          Fork
        </button>
        {isOwned && (
          <button
            className="btn btn-sm btn-outline"
            data-tooltip-id="default-tooltip"
            data-tooltip-content={t('unpublish-flow') + ' ' + flow.name}
            onClick={onDelete}
          >
            <GoTrash
              className={clsx('w-4 h-4', { 'loading loading-xs': isDeleting })}
            />
            Delete
          </button>
        )}
      </div>
      {/* <div className="hidden group-hover:block absolute bottom-1 right-1 text-xs text-base-content/60">
        <div
          className="btn btn-sm btn-ghost btn-square text-red-500/60 hover:text-red-500"
          data-tooltip-id="default-tooltip"
          data-tooltip-content={t('delete-flow') + flow.name}
          onClick={onDelete}
        >
          <GoTrash
            className={clsx('w-4 h-4', { 'loading loading-sm': isDeleting })}
          />
        </div>
      </div> */}
    </div>
  );
};

const PublicFlowList = ({ action }: any) => {
  const { flows, isLoading, isError } = usePublicFlows();
  const t = useTranslations('component.FlowList');

  if (isError) {
    console.warn('Failed to load flow');
  }
  if (isLoading) return <FlowLoading />;
  if (flows.length === 0) return <FlowEmpty />;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
        {flows.map((flow: any) => (
          <FlowBlock key={flow.id} action={action} flow={flow} />
        ))}
      </div>
    </div>
  );
};

export default PublicFlowList;
