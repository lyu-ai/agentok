'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { GenericOption } from '../option/option';

export const ConverseConfig = ({ edgeId, data }: any) => {
  return (
    <ScrollArea className="flex flex-col h-full w-full p-2">
      <div className="flex flex-col gap-4">
        <GenericOption
          type="select"
          nodeId={edgeId}
          data={data}
          name="mode"
          label="Mode"
          options={[
            { value: 'auto', label: 'Auto' },
            { value: 'manual', label: 'Manual' },
          ]}
        />
        <GenericOption
          type="check"
          nodeId={edgeId}
          data={data}
          name="allow_repeat"
          label="Allow Repeat"
        />
      </div>
    </ScrollArea>
  );
};
