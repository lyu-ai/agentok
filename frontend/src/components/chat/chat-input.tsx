'use client';

import { useCallback, useRef, useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useChat, useChats } from '@/hooks/use-chats';
import { toast } from '@/hooks/use-toast';

interface ChatInputProps {
  chatId: number;
  onSend: (message: string) => void;
  onReset?: () => void;
  loading?: boolean;
  disabled?: boolean;
  sampleMessages?: string[];
  className?: string;
}

export const ChatInput = ({
  chatId,
  onSend,
  onReset,
  loading,
  disabled,
  sampleMessages,
  className,
}: ChatInputProps) => {
  const { chat, isLoading, updateChat, isUpdating } = useChat(chatId);
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const handleHumanInput = useCallback(
    async (input: string) => {
      await fetch(`/api/chats/${chatId}/input`, {
        method: 'POST',
        body: JSON.stringify({ type: 'user', content: input }),
      });
    },
    [message, chatId]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage('');
      if (chat?.status === 'wait_for_human_input') {
        await handleHumanInput(message);
      } else {
        onSend(message);
      }
    },
    [message, onSend, handleHumanInput]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as any);
      }
    },
    [handleSubmit]
  );

  const handleClean = useCallback(async () => {
    setIsCleaning(true);
    try {
      await fetch(`/api/chats/${chatId}/messages`, {
        method: 'DELETE',
      });
      onReset?.();
    } catch (e) {
      console.error('Failed to clean chat:', e);
    } finally {
      setIsCleaning(false);
    }
  }, [chatId]);

  const handleReset = useCallback(async () => {
    try {
      setIsResetting(true);
      await handleAbort();
      await handleClean();
      onReset?.();
      updateChat({ status: 'ready' });
    } catch (e) {
      console.error('Failed to reset chat:', e);
      toast({
        title: 'Error',
        description: 'Failed to reset chat',
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  }, [chatId, updateChat, onReset]);

  const handleAbort = useCallback(async () => {
    try {
      const resp = await fetch(`/api/chats/${chatId}/abort`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!resp.ok) {
        throw new Error('Failed to abort chat');
      }
    } catch (err) {
      console.error('Failed to abort chat:', err);
      toast({
        title: 'Error',
        description: 'Failed to abort chat',
        variant: 'destructive',
      });
    }
  }, [chatId]);

  return (
    <form
      className={cn('relative flex items-end gap-2 w-full mx-auto', className)}
      onSubmit={handleSubmit}
    >
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter message to start chat ..."
        className={cn(
          'min-h-[80px] w-full resize-none border border-primary/50 rounded-xl shadow-xl bg-primary-foreground',
          disabled && 'bg-muted',
          sampleMessages?.length && 'pt-10 min-h-[100px]'
        )}
        disabled={disabled}
      />
      {sampleMessages && (
        <div className="absolute top-1 left-2 flex gap-1 right-2">
          {sampleMessages.slice(0, 3).map((message, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setMessage(message)}
              className="h-6 text-xs text-muted-foreground line-clamp-1 flex items-center justify-start"
            >
              {message}
            </Button>
          ))}
        </div>
      )}
      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="h-6 w-6"
          disabled={isUpdating || isCleaning || isResetting}
        >
          <Icons.reset
            className={cn('w-4 h-4', isResetting && 'animate-spin')}
          />
        </Button>
        <div className="flex items-end gap-2">
          {chat?.status === 'wait_for_human_input' && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-6 border-primary/50"
                onClick={() => handleHumanInput('\n')}
              >
                enter
                <Icons.enter className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-6 border-primary/50"
                onClick={() => handleHumanInput('exit')}
              >
                exit
                <Icons.exit className="w-3 h-3" />
              </Button>
            </>
          )}
          {chat?.status === 'running' ? (
            <Button
              variant="outline"
              className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600"
              onClick={handleAbort}
            >
              <Icons.stop className="w-5 h-5 text-muted" />
            </Button>
          ) : (
            <Button
              size="icon"
              disabled={
                disabled ||
                isResetting ||
                chat?.status === 'running' ||
                (!message.trim() && chat?.status !== 'wait_for_human_input')
              }
              className="h-8 w-8 rounded-full p-0"
              onClick={handleSubmit}
            >
              <Icons.send className="w-5 h-5 shrink-0" />
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};
