import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/use-chats';
import { useState } from 'react';
import { Icons } from '../icons';

interface ChatConsoleProps {
  chatId: number;
}

export const ChatConsole = ({ chatId }: ChatConsoleProps) => {
  const { chat } = useChat(chatId);
  const [logs, setLogs] = useState<string[]>([]);
  if (!chat) {
    return (
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col items-center w-full gap-2 p-2">
          <span className="text-sm text-gray-500">No chat selected</span>
        </div>
      </div>
    );
  }

  const handleClear = () => {
    setLogs([]);
  };

  return (
    <div className="relative flex flex-col w-full h-full">
      <div className="absolute top-1 right-1 flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handleClear}>
          <Icons.trash className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex flex-col items-center w-full flex-1">
        {logs.map((log, index) => (
          <div key={index} className="text-sm text-gray-500">
            {log}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
