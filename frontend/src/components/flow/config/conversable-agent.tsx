import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { GenericOption } from '../option/option';

export const ConversableAgentConfig = ({
  show,
  onClose,
  nodeId,
  data,
  optionsDisabled = [],
  className,
  ...props
}: any) => {

  const GENERAL_OPTIONS = [
    {
      type: 'text',
      name: 'description',
      label: 'Description',
      placeholder: 'Enter a description for this agent',
      rows: 2,
    },
    {
      type: 'text',
      name: 'system_message',
      label: 'System Message',
      placeholder: 'Enter the system message for this agent',
      rows: 2,
    },
    {
      type: 'text',
      name: 'termination_msg',
      label: 'Termination Message',
      compact: true,
    },
    {
      type: 'select',
      name: 'human_input_mode',
      label: 'Human Input Mode',
      options: [
        { value: 'NEVER', label: 'Never ask for input' },
        { value: 'ALWAYS', label: 'Always ask for input' },
        { value: 'TERMINATE', label: 'Ask on termination' },
      ],
      compact: true,
    },
    {
      type: 'number',
      name: 'max_consecutive_auto_reply',
      label: 'Max Consecutive Auto Replies',
    },
    {
      type: 'check',
      name: 'enable_rag',
      label: 'Enable RAG',
    },
    {
      type: 'check',
      name: 'disable_llm',
      label: 'Disable LLM',
    },
    {
      type: 'check',
      name: 'enable_code_execution',
      label: 'Enable Code Execution',
    },
  ];

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className={cn(
        className
      )}>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Icons.settings className="w-5 h-5" />
              <span className="text-md font-bold">
                Agent Settings - {data.name}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 w-full p-2 gap-2 min-h-96 max-h-[500px] text-sm overflow-y-auto">
          <div className="flex flex-col gap-2 w-full h-full">
            {GENERAL_OPTIONS.filter((o) => !optionsDisabled.includes(o.name)).map(
              (options, index) => (
                <GenericOption
                  key={index}
                  nodeId={nodeId}
                  data={data}
                  {...options}
                />
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
