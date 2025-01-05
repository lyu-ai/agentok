import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
} from '@xyflow/react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
export function ConverseEdge({ id, data, selected, style, ...props }: any) {
  const [edgePath, labelX, labelY] = getBezierPath({ ...props });
  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: selected ? 'green' : '',
          strokeDasharray: selected ? '5 5' : '0',
          strokeWidth: selected ? 3 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className="button-edge__label nodrag nopan"
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          <Button
            variant="outline"
            size="icon"
            className={cn('rounded-full bg-muted h-7 w-7', {
              'text-green-500 border-green-500': selected,
              'text-muted-foreground/80 border-muted-foreground/80': !selected,
            })}
          >
            <Icons.chat className="w-4 h-4" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
