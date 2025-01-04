'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { GenericOption } from '../option/option';

export const InitializerConfig = ({ nodeId, data }: any) => {
  return (
    <ScrollArea className="flex flex-col h-full w-full p-2">
      <div className="flex flex-col gap-4 h-full w-full">
        <GenericOption
          type="text"
          nodeId={nodeId}
          data={data}
          rows={5}
          name="sample_messages"
          label="Sample Message"
          placeholder="Enter sample messages, one per line."
        />
      </div>
    </ScrollArea>
  );
};
