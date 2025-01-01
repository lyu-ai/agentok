import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import NodePane from './node-pane';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '../icons';

export const NodeButton = ({ className, onAddNode, ...props }: any) => {
  const t = useTranslations('component.NodeButton');
  return (
    <Popover>
      <PopoverTrigger
        className={clsx(
          className,
          'h-10 w-10 flex items-center justify-center bg-primary text-primary-content rounded-full hover:shadow-box hover:shadow-primary/60 hover:bg-primary-focus hover:border-primary/50'
        )}
        {...props}
        data-tooltip-id="default-tooltip"
        data-tooltip-content={t('add-node')}
      >
        <Icons.add className="w-7 h-7" />
      </PopoverTrigger>
      <PopoverContent id="agent-list" className="origin-top-left z-50 w-80">
        <NodePane
          onAddNode={onAddNode}
          pinned={false}
          contentClassName="max-h-[70vh]"
        />
      </PopoverContent>
    </Popover>
  );
};
