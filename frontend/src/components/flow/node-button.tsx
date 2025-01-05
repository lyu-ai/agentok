import { NodeList } from './node-list';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';

export const NodeButton = ({ className, onAddNode, ...props }: any) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="default" size="sm" className={cn(className)}>
          <Icons.add className="w-7 h-7" />
          Add Node
        </Button>
      </PopoverTrigger>
      <PopoverContent id="agent-list" side="bottom" align="start" asChild>
        <ScrollArea className="w-80 h-[calc(100vh-var(--header-height)-4rem)] bg-background p-0">
          <NodeList onAddNode={onAddNode} />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
