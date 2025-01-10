import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/use-chats';
import { useState, useEffect, useRef } from 'react';
import { Icons } from '../icons';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Toggle } from '../ui/toggle';

interface ChatLogPaneProps {
  chatId: number;
}

interface ChatLog {
  id: number;
  chat_id: number;
  level: 'info' | 'warning' | 'error';
  message: string;
  metadata: Record<string, any>;
  created_at: string;
}

export const ChatLogPane = ({ chatId }: ChatLogPaneProps) => {
  const supabase = createClient();
  const { chat } = useChat(chatId);
  const [logs, setLogs] = useState<ChatLog[]>([]);
  const [isClearing, setIsClearing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
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

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleClear = async () => {
    try {
      setIsClearing(true);
      await fetch(`/api/chats/${chatId}/logs`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setLogs([]);
    } catch (e) {
      console.error(`Failed to clear logs:`, (e as any).message);
    } finally {
      setIsClearing(false);
    }
  };

  if (!chat) {
    return (
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col items-center w-full gap-2 p-2">
          <span className="text-sm text-gray-500">No chat selected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col w-full h-full">
      <ScrollArea className="flex flex-col items-center w-full flex-1">
        {logs.length === 0 && (
          <div className="text-sm text-gray-500 p-2 w-full">No logs found</div>
        )}
        {logs.map((log) => (
          <div
            key={log.id}
            className={cn(
              'text-sm text-gray-500 p-2 w-full',
              log.level === 'info' && 'text-gray-500',
              log.level === 'warning' && 'text-yellow-500',
              log.level === 'error' && 'text-red-500'
            )}
          >
            {log.message}
          </div>
        ))}
        <div ref={bottomRef} />
      </ScrollArea>
      <div className="absolute top-1 right-1 flex items-center gap-2">
        <Toggle
          size="sm"
          pressed={autoScroll}
          onPressedChange={setAutoScroll}
          className="flex items-center justify-start px-2 py-1 gap-2"
        >
          <Icons.scroll className="w-4 h-4" />
        </Toggle>
        <Button variant="outline" size="icon" onClick={handleClear}>
          {isClearing ? (
            <Icons.spinner className="w-4 h-4 animate-spin" />
          ) : (
            <Icons.trash className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
