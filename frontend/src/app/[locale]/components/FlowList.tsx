import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { BsInboxes } from 'react-icons/bs';
import { GoTrash } from 'react-icons/go';
import { GrFlows } from 'react-icons/gr';
import { useFlow, useFlows } from '@/hooks';
import clsx from 'clsx';

export const FlowEmpty = () => {
  const t = useTranslations('component.FlowList');
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
  const t = useTranslations('component.FlowList');
  const { deleteFlow, isDeleting } = useFlows();
  const config = flow.flow.nodes.find((node: any) => node.type === 'config');
  let flowDescription = '';
  if (config?.data?.flow_description) {
    flowDescription = config.data.flow_description;
  } else {
    flowDescription = t('default-description', {
      node_count: flow.flow.nodes.length,
      edge_count: flow.flow?.edges?.length ?? 0,
    });
  }
  const onDelete = (e: any) => {
    deleteFlow(flow.id);
    e.stopPropagation();
    e.preventDefault();
  };
  return (
    <Link
      key={flow.id}
      className="group relative flex flex-col pb-6 bg-base-content/10 rounded-md p-3 gap-3 hover:bg-base-content/20 cursor-pointer"
      href={`/${action ?? 'flow'}/${flow.id}`}
    >
      <div className="flex items-center gap-2 group-hover:text-primary">
        <GrFlows className="w-6 h-6" />
        <h2 className="font-bold">{flow.name}</h2>
      </div>
      <div className="flex flex-col h-full justify-between gap-2">
        <div className="text-left text-sm">{flowDescription}</div>
        <div className="flex items-center justify-between bottom-2">
          <div className="text-xs text-base-content/60">
            {new Date(flow.created_at).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="hidden group-hover:block absolute bottom-1 right-1 text-xs text-base-content/60">
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
      </div>
    </Link>
  );
};

const FlowList = ({ action }: any) => {
  const { flows, isLoading, isError } = useFlows();
  const t = useTranslations('component.FlowList');

  if (isError) {
    console.warn('Failed to load flow');
  }
  if (isLoading) return <FlowLoading />;
  if (flows.length === 0) return <FlowEmpty />;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2">
        {flows.map((flow: any) => (
          <FlowBlock key={flow.id} action={action} flow={flow} />
        ))}
      </div>
    </div>
  );
};

export default FlowList;
