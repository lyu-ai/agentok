'use client';

import {
  Handle,
  Position,
  HandleType,
  NodeProps,
} from '@xyflow/react';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

export type WrapNodeProps = NodeProps & {
  config?: React.ComponentType<any>;
  ports?: { type: HandleType; name?: string }[];
  children?: React.ReactNode;
  nodeClass?: string;
  className?: string;
};

export const GenericNode = ({
  id,
  data,
  selected,
  config,
  ports = [],
  children,
}: WrapNodeProps) => {
  return (
    <div
      className={cn(
        'group relative flex flex-col bg-muted min-w-24 gap-2 p-4 rounded-xl border-2 shadow-box',
        'hover:border-brand hover:text-brand transition-colors duration-300',
        {
          'border-brand/80 text-brand/80': selected,
        },
      )}
    >
      {ports.map(({ type, name }, i) => (
        <Handle
          key={i}
          type={type}
          position={type === 'target' ? Position.Left : Position.Right}
          id={name}
          className={cn(
            'w-3 h-3 rounded-full border-2 bg-base-content/10',
            'border-base-content/10 hover:border-primary',
            {
              'border-primary': selected,
            }
          )}
        />
      ))}
      <div className="flex flex-col items-center gap-2 flex-grow">
        <Icons.node className="w-10 h-10" />
        <span className="text-sm font-bold">{data.name as string}</span>
      </div>
    </div>
  );
};
