import { useFlows } from '@/hooks';
import Link from 'next/link';
import { GoX } from 'react-icons/go';
import clsx from 'clsx';
import { RiRobot2Line } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type FlowMeta = {
  id: string;
  name: string;
};

const FlowTabs = ({ className }: any) => {
  const router = useRouter();
  const { flows, openFlowIds, activeFlowId, closeFlow } = useFlows();
  const [flowMetas, setFlowMetas] = useState<FlowMeta[]>([]);
  useEffect(() => {
    const flowInfo = openFlowIds
      .map(flowId => {
        const targetFlow = flows.find(flow => flow.id === flowId);
        if (targetFlow) {
          return {
            id: flowId,
            name: targetFlow.name,
          };
        } else {
          closeFlow(flowId); // Clean up dirty data
          return undefined;
        }
      })
      .filter(Boolean);
    setFlowMetas(flowInfo as FlowMeta[]);
  }, [openFlowIds, flows, closeFlow]);

  const onCloseFlow = (flowId: string) => {
    const currentIndex = openFlowIds.indexOf(flowId);
    const nextFlowId =
      openFlowIds.length <= 1
        ? ''
        : currentIndex > 0
        ? openFlowIds[currentIndex - 1]
        : openFlowIds[currentIndex + 1];

    closeFlow(flowId);

    router.replace(`/flows/${nextFlowId}`);
  };

  if (!flows) return null;

  return (
    <div className={clsx('flex gap-1', className)}>
      {flowMetas.map(({ id, name }, i) => (
        <Link
          key={id}
          className={`${
            activeFlowId === id
              ? 'bg-primary/80 text-primary-content'
              : 'bg-base-content/80 text-base-100'
          } group relative flex flex-shrink-0 items-center gap-1 px-3 py-1 text-sm rounded-full hover:bg-primary/80 hover:text-primary-content`}
          href={`/flows/${id}`}
        >
          <RiRobot2Line className="w-4 h-4" />
          <span className="max-w-xs truncate text-sm">{name}</span>
          <button
            className="rounded-full hidden group-hover:flex hover:text-red-500"
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              onCloseFlow(id);
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
