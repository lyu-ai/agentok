import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/use-chats';
import { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { createClient } from '@/lib/supabase/client';

interface ChatLogPaneProps {
  chatId: number;
}

interface ChatLog {
  id: number;
  chat_id: number;
  content: string;
  created_at: string;
}

export const ChatLogPane = ({ chatId }: ChatLogPaneProps) => {
  const supabase = createClient();
  const { chat } = useChat(chatId);
  const [logs, setLogs] = useState<ChatLog[]>([]);

  useEffect(() => {
    // Initial fetch of logs
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('chat_logs')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (data) setLogs(data);
    };

    // Set up real-time subscription
    const channel = supabase
      .channel(`chat_logs_${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_logs',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLogs((current) => [...current, payload.new as ChatLog]);
          }
        }
      )
      .subscribe();

    fetchLogs();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, supabase]);

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
        {logs.length === 0 && (
          <div className="text-sm text-gray-500 p-2 w-full">No logs found</div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="text-sm text-gray-500 p-2 w-full">
            {log.content}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
