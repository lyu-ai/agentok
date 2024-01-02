import { Popover } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import clsx from 'clsx';
import { advancedNodes, basicNodes, getNodeLabel } from '../utils/flow';
import { GoPlus } from 'react-icons/go';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { BsRobot } from 'react-icons/bs';

const DRAGGING_NODE_NAME = '__dragging-node';

const NodeButton = ({ className, onAddNode, ...props }: any) => {
  const [customAgents, setCustomAgents] = useState<any[]>([]);
  const tNodeMeta = useTranslations('meta.node');
  const t = useTranslations('component.NodeButton');
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
    document.body.appendChild(dragImage);
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
  };

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
            <Popover.Button
              as="a"
              draggable
              onDragStart={event =>
                onDragStart(event, {
                  type,
                  name,
                  label,
                  class: _class,
                })
              }
              onDragEnd={() => {
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
              className="group min-w-64 flex p-2 items-center rounded-lg hover:bg-base-content/10 cursor-pointer"
            >
              <Icon className="flex-shrink-0 w-6 h-6 mx-1 group-hover:text-white" />
              <div className="ml-3 flex flex-col gap-1">
                <div className="text-sm font-bold group-hover:text-white">
                  {type === 'custom_conversable'
                    ? label
                    : getNodeLabel(label, tNodeMeta)}
                </div>
                <div className="text-xs text-base-content/40 group-hover:text-white/80">
                  {type === 'custom_conversable'
                    ? description
                    : getNodeLabel(label + '-description', tNodeMeta) ??
                      label + '-description'}
                </div>
              </div>
            </Popover.Button>
          )
        )}
      </>
    );
  };

  const NodeGroup = ({ index, name, nodes, open }: any) => {
    return (
      <div
        tabIndex={index}
        className={clsx('collapse collapse-arrow rounded-lg', {
          'collapse-open': open,
        })}
      >
        <div className="collapse-title flex items-center font-bold text-sm">
          {name}
        </div>
        <div className="collapse-content flex flex-col gap-1 p-1">
          {buildAgentNodes(nodes)}
        </div>
      </div>
    );
  };

  return (
    <Popover>
      <Float
        placement="bottom"
        offset={5}
        enter="transition ease-out duration-300"
        enterFrom="transform scale-0 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-0 opacity-0"
      >
        <Popover.Button
          className={clsx(className, 'btn btn-sm btn-primary btn-circle')}
          {...props}
        >
          <GoPlus className="w-6 h-6" />
        </Popover.Button>
        <Popover.Panel
          id="agent-list"
          className="origin-top-left absolute shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600 overflow-auto max-h-[80vh]"
        >
          <NodeGroup index={0} name="Basic" nodes={basicNodes} />
          <NodeGroup index={1} name="Advanced" nodes={advancedNodes} />
          {customAgents?.length > 0 && (
            <NodeGroup index={2} name="Extensions" nodes={customAgents} />
          )}
        </Popover.Panel>
      </Float>
    </Popover>
  );
};

export default NodeButton;
