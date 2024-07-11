import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { BsRobot } from 'react-icons/bs';
import {
  getNodeLabel,
  basicNodes,
  agentNodes,
  advancedNodes,
} from '../utils/flow';
import useProjectStore from '@/store/projects';
import { RiPushpinLine, RiUnpinLine } from 'react-icons/ri';

const DRAGGING_NODE_NAME = '__dragging-node';

const NodeGroup = ({ pinned, name, nodes, open, onAddNode }: any) => {
  const tNodeMeta = useTranslations('meta.node');
  const [openState, setOpenState] = useState(open ?? false);
  const onDragStart = (
    event: React.DragEvent<any>,
    data: { type: string; name: string; label: string; class: string }
  ) => {
    let dragImage = event.currentTarget.cloneNode(true);
    dragImage.classList.add(
      'absolute',
      'bg-gray-700/90',
      'shadow-box',
      'shadow-gray-600',
      'backdrop-blur-sm',
      DRAGGING_NODE_NAME
    );
    // Create an off-screen container for the drag image
    let offScreenContainer = document.createElement('div');
    offScreenContainer.style.position = 'fixed';
    offScreenContainer.style.top = '-9999px';
    offScreenContainer.style.left = '-9999px';
    document.body.appendChild(offScreenContainer);
    offScreenContainer.appendChild(dragImage);
    // Offset the drag image to the position of the original element, otherwise will be shown at the cursor position
    const offsetX =
      event.clientX - event.currentTarget.getBoundingClientRect().left;
    const offsetY =
      event.clientY - event.currentTarget.getBoundingClientRect().top;
    event.dataTransfer.setDragImage(dragImage, offsetX, offsetY);
    event.dataTransfer.setData(
      'json',
      JSON.stringify({ ...data, offsetX, offsetY })
    );
    // Clean up the off-screen container after the drag operation ends
    event.currentTarget.addEventListener(
      'dragend',
      () => {
        if (offScreenContainer) {
          document.body.removeChild(offScreenContainer);
        }
      },
      { once: true }
    );
  };
  const ButtonType = pinned ? Popover.Button : 'button';

  const buildAgentNodes = (nodes: any) => {
    return (
      <>
        {nodes.map(
          ({
            id,
            name,
            description,
            label,
            type,
            class: _class,
            icon: Icon = BsRobot,
          }: any) => (
            <ButtonType
              as="a"
              draggable
              onDragStart={event => {
                onDragStart(event, {
                  type,
                  name,
                  label,
                  class: _class,
                });
              }}
              onDragEnd={event => {
                const dragImage = document.querySelector(
                  `.${DRAGGING_NODE_NAME}`
                );
                if (dragImage) {
                  document.body.removeChild(dragImage);
                }
              }}
              key={id}
              onClick={() =>
                onAddNode(type, { name, class: _class, label, type })
              }
              className="group min-w-64 flex p-2 items-center rounded-lg bg-base-content/5 hover:bg-base-content/10 cursor-pointer"
            >
              <Icon className="flex-shrink-0 w-6 h-6 mx-1 group-hover:text-white group-hover:scale-125 transform transition duration-300 ease-in-out" />
              <div className="ml-3 flex flex-col items-start gap-1">
                <div className="text-sm font-bold group-hover:text-white">
                  {type === 'custom_conversable'
                    ? label
                    : getNodeLabel(label, tNodeMeta)}
                </div>
                <div className="text-left text-xs text-base-content/40 group-hover:text-white/80">
                  {type === 'custom_conversable'
                    ? description
                    : getNodeLabel(label + '-description', tNodeMeta) ??
                      label + '-description'}
                </div>
              </div>
            </ButtonType>
          )
        )}
      </>
    );
  };
  return (
    <div className="collapse collapse-arrow">
      <input
        type="checkbox"
        onChange={e => setOpenState(e.target.checked)}
        checked={openState}
      />
      <div
        className={clsx('collapse-title flex items-center font-bold text-sm', {
          'text-white': openState,
        })}
      >
        {name}
      </div>
      <div className="collapse-content flex flex-col gap-1 p-1">
        {buildAgentNodes(nodes)}
      </div>
    </div>
  );
};

const NodePane = ({ pinned, onAddNode, contentClassName }: any) => {
  const t = useTranslations('component.NodeButton');
  const [customAgents, setCustomAgents] = useState<any[]>([]);
  const { nodePanePinned, pinNodePane } = useProjectStore();
  useEffect(() => {
    fetch('/api/agents', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(agents => {
        setCustomAgents(agents);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div className="flex w-full h-full flex-col gap-2 backdrop-blur-md shadow-box shadow-gray-700 rounded-xl bg-gray-700/70 text-base-content border border-gray-600 ">
      <div className="flex items-center justify-between p-2">
        <div className="font-bold">{t('add-node')}</div>
        <button
          className="btn btn-ghost btn-square btn-xs"
          onClick={() => pinNodePane(!nodePanePinned)}
          data-tooltip-content={nodePanePinned ? t('unpin') : t('pin')}
          data-tooltip-id="default-tooltip"
        >
          {nodePanePinned ? (
            <RiUnpinLine className="w-4 h-4" />
          ) : (
            <RiPushpinLine className="w-4 h-4" />
          )}
        </button>
      </div>
      <div
        className={clsx(
          'flex flex-col flex-grow overflow-y-auto',
          contentClassName
        )}
      >
        <div className="flex flex-col w-full">
          <NodeGroup
            pinned={pinned}
            name={t('group-basic')}
            nodes={basicNodes}
            onAddNode={onAddNode}
            open
          />
          <NodeGroup
            pinned={pinned}
            name={t('group-agent')}
            nodes={agentNodes}
            onAddNode={onAddNode}
            open
          />
          {/* <NodeGroup
            pinned={pinned}
            name={t('group-advanced')}
            nodes={advancedNodes}
            onAddNode={onAddNode}
          />
          {customAgents?.length > 0 && (
            <NodeGroup
              pinned={pinned}
              name={t('group-extensions')}
              nodes={customAgents}
              onAddNode={onAddNode}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};

export default NodePane;
