import { NodeList } from './node-list';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

export const NodeButton = ({ className, onAddNode, ...props }: any) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" size="sm" className={cn(className)}>
          <Icons.add className="w-7 h-7" />
          Add Node
        </Button>
      </PopoverTrigger>
      <PopoverContent id="agent-list" className="w-80 p-2" side="bottom" align="start">
        <NodeList />
      </PopoverContent>
    </Popover>
  );
};
