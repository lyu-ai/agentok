import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { BsInboxes } from 'react-icons/bs';
import { GoAlertFill, GoPencil, GoTrash, GoX } from 'react-icons/go';
import { GrFlows } from 'react-icons/gr';
import { RiAppsFill } from 'react-icons/ri';
import { Tooltip } from 'react-tooltip';
import { useRouter } from 'next/navigation';

const FlowPicker = ({ onChat, onLoad: _onLoad, onReset }: any) => {
  const [loading, setLoading] = useState(true);
  const [flows, setFlows] = useState<any[]>([]);
  const router = useRouter();

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

  const Loading = () => {
    return (
      <div className="flex flex-col w-full h-full p-2">
        <div className="grid grid-cols-2 gap-2">
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

  const onLoad = (e: any, flowData: any) => {
    e.stopPropagation();
    _onLoad && _onLoad(flowData);
  };

  const onDelete = async (e: any, flowData: any) => {
    e.stopPropagation();
    const res = await fetch(`/api/flows/${flowData.id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setFlows(flows.filter(flow => flow.id !== flowData.id));
    }
  };

  const Empty = () => {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col gap-2 items-center text-base-content/60">
          <BsInboxes className="w-12 h-12" />
          <div className="mt-2 text-sm">
            没有找到任何流程，你可以创建一个新的
          </div>
          <Popover.Button
            className="btn btn-sm btn-secondary"
            onClick={onReset}
          >
            创建新流程
          </Popover.Button>
        </div>
      </div>
    );
  };

  const FlowList = () => {
    const [hideAlert, setHideAlert] = useState(false);
    return (
      <div className="flex flex-col gap-2 p-2">
        <div
          className={clsx(
            'group relative flex flex-col border border-yellow-500/50 rounded-md gap-2 p-2 text-sm text-yellow-500/80 bg-yellow-500/20 my-1',
            { hidden: hideAlert }
          )}
        >
          <div className="flex items-center gap-2">
            <GoAlertFill className="w-5 h-5" />
            <span className="font-bold">注意</span>
          </div>
          <span>
            流程列表中的流程是全局共享的，你的工作可能会被其他人修改或删除。
          </span>
          <div className="absolute right-1 top-1 hidden group-hover:block">
            <button
              className="btn btn-xs btn-square btn-ghost"
              onClick={() => setHideAlert(true)}
            >
              <GoX className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {flows.map(flowData => {
            const config = flowData.flow.nodes.find(
              (node: any) => node.type === 'config'
            );
            let flowDescription = '';
            if (config?.data?.flow_description) {
              flowDescription = config.data.flow_description;
            } else {
              flowDescription = `无描述（包含${
                flowData.flow.nodes.length
              }个节点，${flowData.flow?.edges?.length ?? 0}条连线）`;
            }
            return (
              <Popover.Button
                key={flowData.id}
                className="group relative flex flex-col pb-6 bg-base-content/10 rounded-md p-3 gap-3 hover:bg-base-content/20 cursor-pointer"
                onClick={() => router.push(`/flowgen/${flowData.id}`)}
              >
                <div className="flex items-center gap-2 group-hover:text-secondary">
                  <GrFlows className="w-6 h-6" />
                  <h2 className="font-bold">{flowData.id}</h2>
                </div>
                <div className="text-left text-sm">{flowDescription}</div>
                <div className="hidden group-hover:block absolute bottom-1 right-1 text-xs text-base-content/60">
                  <div
                    className="btn btn-sm btn-ghost btn-square text-red-500/60 hover:text-red-500"
                    data-tooltip-id="chat-tooltip"
                    data-tooltip-content={'删除 ' + flowData.id}
                    onClick={e => onDelete(e, flowData)}
                  >
                    <GoTrash className="w-4 h-4" />
                  </div>
                </div>
              </Popover.Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="flex items-center gap-2 text-sm font-bold p-2">
        <RiAppsFill className="w-5 h-5" />
        <span>选择一个流程</span>
      </div>
      <div className="w-full h-full overflow-y-auto transition-all ease-in-out">
        {loading ? <Loading /> : flows.length === 0 ? <Empty /> : <FlowList />}
      </div>
      <Tooltip id="chat-tooltip" place="bottom" />
    </div>
  );
};

export default FlowPicker;
