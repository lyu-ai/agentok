import { NodePane } from './node-pane';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';

export const NodeButton = ({ className, onAddNode, ...props }: any) => {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          className,
          'h-10 w-10 flex items-center justify-center bg-primary text-primary-content rounded-full hover:shadow-box hover:shadow-primary/60 hover:bg-primary-focus hover:border-primary/50'
        )}
        {...props}
      >
        <Icons.add className="w-7 h-7" />
      </PopoverTrigger>
      <PopoverContent id="agent-list" className="origin-top-left z-50 w-80">
        <NodePane
        />
      </PopoverContent>
    </Popover>
  );
};
