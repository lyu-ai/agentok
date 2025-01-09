'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { GenericOption } from '../option/option';

export const InitializerConfig = ({ nodeId, data }: any) => {
  return (
    <ScrollArea className="flex flex-col h-full w-full">
      <div className="flex flex-col gap-4 h-full w-full p-2">
        <GenericOption
          type="text"
          nodeId={nodeId}
          data={data}
          name="name"
          label="Name"
          placeholder="Enter a name for this agent"
        />
        <GenericOption
          type="text"
          nodeId={nodeId}
          data={data}
          rows={3}
          name="sample_messages"
          label="Sample Message (One per line)"
          placeholder="Enter sample messages, one per line."
        />
      </div>
    </ScrollArea>
  );
};
