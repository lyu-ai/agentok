import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { BsInboxes } from 'react-icons/bs';
import { GoShare, GoTrash } from 'react-icons/go';
import { useFlows, useTemplates } from '@/hooks';
import clsx from 'clsx';
import { useState } from 'react';
import PopupDialog from '@/components/PopupDialog';
import { toast } from 'react-toastify';
import { AutoflowTemplate } from '@/store/template';
import { RiRobot2Line } from 'react-icons/ri';
import Markdown from '@/components/Markdown';

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
    <div className="flex flex-wrap justify-center gap-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="group relative  w-80 h-48 flex flex-col bg-base-content/10 rounded-md p-3 gap-3"
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
  );
};

const PublishTemplateDialog = ({ className, flow, ...props }: any) => {
  const t = useTranslations('component.FlowList');
  const { publishTemplate, isPublishing } = useTemplates();
  const [name, setName] = useState(flow.name);
  const getInitialDescription = (flow: any) => {
    const config = flow.flow?.nodes?.find(
      (node: any) => node.type === 'config'
    );
    let flowDescription = '';
    if (config?.data?.flow_description) {
      flowDescription = config.data.flow_description;
    } else {
      flowDescription = t('default-description', {
        node_count: flow.flow?.nodes?.length ?? 0,
        edge_count: flow.flow?.edges?.length ?? 0,
      });
    }
    return flowDescription;
  };
  const [description, setDescription] = useState(getInitialDescription(flow));

  const onPublish = async () => {
    const result = await publishTemplate({
      name,
      description,
      flow: flow.flow,
      owner: flow.owner,
    } as AutoflowTemplate);
    if (result) {
      toast.success(t('publish-flow-success', { flow_name: name }));
    } else {
      toast.error(t('publish-flow-failed', { flow_name: name }));
    }
    props.onClose();
  };

  return (
    <PopupDialog
      title={
        <div className="flex items-center gap-2">
          <GoShare className="w-7 h-7" />
          <span className="text-md font-bold">{t('publish-flow-title')}</span>
        </div>
      }
      className={clsx(
        'flex flex-col h-full w-96 bg-gray-800/80 backgrop-blur-md border border-gray-700 shadow-box-lg shadow-gray-700',
        className
      )}
      classNameTitle="border-b border-base-content/10"
      classNameBody="flex flex-grow h-full p-4"
      {...props}
    >
      <div className="flex flex-col gap-2 flex-grow h-full overflow-y-auto">
        <span className="py-4">{t('publish-flow-tip')}</span>
        <span className="text-base-content/50">{t('publish-flow-name')}</span>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="input input-bordered"
        />
        <span className="text-base-content/50">
          {t('publish-flow-description')}
        </span>
        <textarea
          value={description}
          rows={3}
          onChange={e => setDescription(e.target.value)}
          className="nodrag nowheel textarea textarea-bordered"
        />
        <button className="btn btn-primary" onClick={onPublish}>
          {isPublishing && <div className="loading loading-sm" />}
          {t('publish-flow')}
        </button>
      </div>
    </PopupDialog>
  );
};

const FlowBlock = ({ action: Action, flow, suppressLink }: any) => {
  const t = useTranslations('component.FlowList');
  const { deleteFlow, isDeleting } = useFlows();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const config = flow.flow?.nodes?.find((node: any) => node.type === 'config');
  let flowDescription = '';
  if (config?.data?.flow_description) {
    flowDescription = config.data.flow_description;
  } else {
    flowDescription = t('default-description', {
      node_count: flow.flow?.nodes?.length ?? 0,
      edge_count: flow.flow?.edges?.length ?? 0,
    });
  }
  const onDelete = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    await deleteFlow(flow.id);
  };
  const ConditionalLink = ({ children, className }: any) => {
    if (suppressLink) {
      return <div className={className}>{children}</div>;
    } else {
      return (
        <Link href={`/flow/${flow.id}`} className={className}>
          {children}
        </Link>
      );
    }
  };
  return (
    <ConditionalLink
      key={flow.id}
      className={clsx(
        'card group relative flex flex-col w-80 bg-base-content/10 gap-3 border border-base-content/10',
        {
          'hover:shadow-box hover:shadow-primary/40 hover:border-primary/20': !suppressLink,
        }
      )}
    >
      <div className="card-title flex items-center bg-primary/5 group-hover:bg-primary/10 rounded-t-xl gap-4 group-hover:text-primary p-4">
        <RiRobot2Line className="w-8 h-8" />
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold hover:text-primary line-clamp-1">
            {flow.name}
          </h2>
          <div className="text-xs text-base-content/60">
            {new Date(flow.created).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="card-body p-2">
        <div className="h-20 text-left text-sm break-word word-wrap line-clamp-3">
          <Markdown suppressLink={!suppressLink}>{flowDescription}</Markdown>
        </div>
        <div className="flex justify-end text-xs gap-2 text-base-content/60">
          {Action ? (
            <Action flow={flow} />
          ) : (
            <>
              {/* <Link
                className="btn btn-sm btn-square btn-ghost group-hover:text-primary"
                data-tooltip-id="default-tooltip"
                data-tooltip-content={t('edit-flow')}
                href={`/flow/${flow.id}`}
              >
                <GoPencil className={clsx('w-4 h-4')} />
              </Link> */}
              <button
                className="btn btn-sm btn-square btn-ghost group-hover:text-primary"
                data-tooltip-id="default-tooltip"
                data-tooltip-content={t('publish-flow')}
                onClick={e => {
                  e.stopPropagation();
                  e.preventDefault();
                  setShowPublishModal(!showPublishModal);
                }}
              >
                <GoShare className={clsx('w-4 h-4')} />
              </button>
              <button
                className="btn btn-sm btn-square btn-ghost group-hover:text-red-400"
                data-tooltip-id="default-tooltip"
                data-tooltip-content={t('delete-flow') + flow.name}
                onClick={onDelete}
              >
                <GoTrash
                  className={clsx('w-4 h-4', {
                    'loading loading-sm': isDeleting,
                  })}
                />
              </button>
            </>
          )}
        </div>
      </div>
      {showPublishModal && (
        <PublishTemplateDialog
          show={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          flow={flow}
        />
      )}
    </ConditionalLink>
  );
};

const FlowList = ({ action, suppressLink }: any) => {
  const { flows, isLoading, isError } = useFlows();
  const t = useTranslations('component.FlowList');

  if (isError) {
    console.warn('Failed to load flow', isError);
  }
  if (isLoading) return <FlowLoading />;
  if (!flows || flows.length === 0) return <FlowEmpty />;

  return (
    <div className="flex flex-wrap justify-center gap-4 p-2">
      {flows.map((flow: any) => (
        <FlowBlock
          key={flow.id}
          action={action}
          flow={flow}
          suppressLin={suppressLink}
        />
      ))}
    </div>
  );
};

export default FlowList;
