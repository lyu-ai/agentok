import { Popover } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import clsx from 'clsx';
import { getNodeLabel, nodeMetas } from '../utils/flow';
import { GoPlus } from 'react-icons/go';
import { useTranslations } from 'next-intl';

const DRAGGING_NODE_NAME = '__dragging-node';

const NodeButton = ({ className, onAddNode, ...props }: any) => {
  const tNodeMeta = useTranslations('meta.node');
  const onDragStart = (
    event: React.DragEvent<any>,
    data: { type: string; name: string; label: string; class: string; }
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
          className={clsx(
            className,
            'btn btn-sm btn-secondary hover:shadow-box shadow-indigo-300 btn-circle ring-none outline-none'
          )}
          {...props}
        >
          <GoPlus className="w-6 h-6" />
        </Popover.Button>
        <Popover.Panel
          id="agent-list"
          className="origin-top-left absolute shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-700/70 text-base-content border border-gray-600 overflow-auto max-h-[80vh]"
        >
          {nodeMetas.map(
            ({
              id,
              name,
              label,
              type,
              class: _class,
              icon: Icon,
            }) => (
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
                  onAddNode(type, { name, class: _class, type })
                }
                className="group min-w-64 flex p-2 items-center rounded-lg hover:bg-base-content/10 cursor-pointer"
              >
                <Icon className="flex-shrink-0 w-6 h-6 mx-1 group-hover:text-white" />
                <div className="ml-3 flex flex-col gap-1">
                  <div className="text-sm font-bold group-hover:text-white">
                    {getNodeLabel(label, tNodeMeta) ?? label}
                  </div>
                  <div className="text-xs text-base-content/40 group-hover:text-white/80">
                    {getNodeLabel(label + '-description', tNodeMeta) ?? label + '-description'}
                  </div>
                </div>
              </Popover.Button>
            )
          )}
        </Popover.Panel>
      </Float>
    </Popover>
  );
};

export default NodeButton;
