import { Popover } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import clsx from 'clsx';
import { GoPlus } from 'react-icons/go';
import { useTranslations } from 'next-intl';
import NodePane from './NodePane';

const NodeButton = ({ className, onAddNode, ...props }: any) => {
  const t = useTranslations('component.NodeButton');
  return (
    <Popover>
      <Float
        placement="bottom-start"
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
            'h-10 w-10 flex items-center justify-center bg-primary text-primary-content rounded-full hover:shadow-box hover:shadow-primary/60 hover:bg-primary-focus hover:border-primary/50'
          )}
          {...props}
          data-tooltip-id="default-tooltip"
          data-tooltip-content={t('add-node')}
        >
          <GoPlus className="w-7 h-7" />
        </Popover.Button>
        <Popover.Panel id="agent-list" className="origin-top-left z-50 w-80">
          <NodePane
            onAddNode={onAddNode}
            pinned={false}
            contentClassName="max-h-[70vh]"
          />
        </Popover.Panel>
      </Float>
    </Popover>
  );
};

export default NodeButton;
