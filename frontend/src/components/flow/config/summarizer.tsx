'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { GenericOption } from '../option/option';

export const SummarizerConfig = ({ nodeId, data }: any) => {
  return (
    <ScrollArea className="flex flex-col h-full w-full p-2">
      <div className="flex flex-col gap-4">
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
      </div>
    </ScrollArea>
  );
};
