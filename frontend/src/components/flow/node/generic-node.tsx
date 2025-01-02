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
  ports?: { type: HandleType; name?: string }[];
};

export const GenericNode = ({
  id,
  data,
  selected,
  ports = [],
}: WrapNodeProps) => {
  return (
    <>
      <div
        className={cn(
          'group relative flex flex-col min-w-24 gap-2 p-4 rounded-xl border shadow-box',
          'hover:border-primary/40',
          {
            'shadow-primary/40': selected,
            'border-primary': selected,
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
    </>
  );
};
