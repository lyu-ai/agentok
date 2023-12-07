import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BsInboxes } from 'react-icons/bs';
import { GoTrash  } from 'react-icons/go';
import { GrFlows } from 'react-icons/gr';

export const FlowEmpty = () => {
  const t = useTranslations('component.FlowList');
  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-col gap-2 items-center text-base-content/60">
        <BsInboxes className="w-12 h-12" />
        <div className="mt-2 text-sm">{t('flow-empty')}</div>
        {/* <div className="btn btn-sm btn-secondary" onClick={onReset}>
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

const FlowList = ({ action }: any) => {
  const [loading, setLoading] = useState(true);
  const [flows, setFlows] = useState<any[]>([]);
  const t = useTranslations('component.FlowList');

  useEffect(() => {
    setLoading(true);
    fetch('/api/flows')
      .then(resp => resp.json())
      .then(json => {
        setFlows(json);
      })
      .catch(e => {
        console.warn('Failed loading flow:', e.statusText);
      })
      .finally(() => setLoading(false));
  }, []);

  const onDelete = async (e: any, flowData: any) => {
    e.stopPropagation();
    const res = await fetch(`/api/flows/${flowData.id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setFlows(flows.filter(flow => flow.id !== flowData.id));
    }
  };

  if (loading) return <FlowLoading />;

  if (flows.length === 0) return <FlowEmpty />;

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-2">
        {flows.map((flowData: any) => {
          const config = flowData.flow.nodes.find(
            (node: any) => node.type === 'config'
          );
          let flowDescription = '';
          if (config?.data?.flow_description) {
            flowDescription = config.data.flow_description;
          } else {
            flowDescription = t('default-description', {
              node_count: flowData.flow.nodes.length,
              edge_count: flowData.flow?.edges?.length ?? 0,
            });
          }
          return (
            <Link
              key={flowData.id}
              className="group relative flex flex-col pb-6 bg-base-content/10 rounded-md p-3 gap-3 hover:bg-base-content/20 cursor-pointer"
              href={`/${action ?? 'flow'}/${flowData.id}`}
            >
              <div className="flex items-center gap-2 group-hover:text-secondary">
                <GrFlows className="w-6 h-6" />
                <h2 className="font-bold">{flowData.id}</h2>
              </div>
              <div className="text-left text-sm">{flowDescription}</div>
              <div className="hidden group-hover:block absolute bottom-1 right-1 text-xs text-base-content/60">
                <div
                  className="btn btn-sm btn-ghost btn-square text-red-500/60 hover:text-red-500"
                  data-tooltip-id="default-tooltip"
                  data-tooltip-content={t('delete-flow') + flowData.id}
                  onClick={e => onDelete(e, flowData)}
                >
                  <GoTrash className="w-4 h-4" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default FlowList;
