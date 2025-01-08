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
        <GenericOption
          type="select"
          nodeId={nodeId}
          data={data}
          name="summary_method"
          label="Summary Method"
          options={[
            { value: 'last_msg', label: 'Last Message' },
            { value: 'reflection_with_llm', label: 'Reflection with LLM' },
          ]}
        />
        <GenericOption
          type="range"
          nodeId={nodeId}
          data={data}
          name="max_turns"
          label="Max Turns"
          min={1}
          max={50}
          step={1}
        />
      </div>
    </ScrollArea>
  );
};
