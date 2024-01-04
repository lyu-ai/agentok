import { useFlows } from '@/hooks';
import Link from 'next/link';
import { GoX } from 'react-icons/go';
import clsx from 'clsx';
import { RiRobot2Line } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

const FlowTabs = ({ className }: any) => {
  const router = useRouter();
  const { flows, openFlowIds, activeFlowId, closeFlow } = useFlows();
  if (!flows) return null;

  const onCloseFlow = (flowId: string) => {
    const currentIndex = openFlowIds.indexOf(flowId);
    const nextFlowId =
      openFlowIds.length <= 1
        ? ''
        : currentIndex > 0
        ? openFlowIds[currentIndex - 1]
        : openFlowIds[currentIndex + 1];

    closeFlow(flowId);

    router.replace(`/flow/${nextFlowId}`);
  };

  return (
    <div className={clsx('flex gap-1', className)}>
      {openFlowIds.map((flowId, i) => (
        <Link
          key={flowId}
          className={`${
            activeFlowId === flowId
              ? 'bg-primary/80 text-primary-content'
              : 'bg-base-content/20 text-base-content'
          } group relative flex flex-shrink-0 items-center gap-1 px-3 py-1 text-sm rounded-full hover:bg-primary/80 hover:text-primary-content`}
          href={`/flow/${flowId}`}
        >
          <RiRobot2Line className="w-4 h-4" />
          <span className="max-w-xs truncate text-sm">
            {flows.find(flow => flow.id === flowId)?.name ?? 'Untitled'}
          </span>
          <button
            className="rounded-full hidden group-hover:flex hover:text-red-500"
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              onCloseFlow(flowId);
            }}
          >
            <GoX className="w-4 h-4" />
          </button>
        </Link>
      ))}
    </div>
  );
};

export default FlowTabs;
