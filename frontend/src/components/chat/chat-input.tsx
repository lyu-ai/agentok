'use client';

import { useCallback, useRef, useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Chat } from '@/store/chats';
import { useChat, useChats } from '@/hooks/use-chats';
import { toast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

interface ChatInputProps {
  chatId: number;
  onSubmit: (message: string) => void;
  onAbort?: () => void;
  onReset?: () => void;
  loading?: boolean;
  disabled?: boolean;
  sampleMessages?: string[];
  className?: string;
}

export const ChatInput = ({
  chatId,
  onSubmit,
  onAbort,
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
      if (loading || disabled) return;
      if (chat?.status === 'wait_for_human_input') {
        await handleHumanInput(message);
      } else {
        onSubmit(message);
      }
      setMessage('');
    },
    [message, loading, disabled, onSubmit, handleHumanInput]
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
        <div className="absolute top-2 left-2 flex gap-2 right-0">
          {sampleMessages.slice(0, 3).map((message, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setMessage(message)}
              className="h-6 text-xs text-muted-foreground w-1/3 line-clamp-1 flex items-center justify-start"
            >
              <Icons.messageSquare className="w-3 h-3" />
              {message}
            </Button>
          ))}
        </div>
      )}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className="h-7 w-7"
          disabled={isUpdating || isCleaning || isResetting}
        >
          <Icons.reset
            className={cn('w-4 h-4', isResetting && 'animate-spin')}
          />
        </Button>
        <div className="flex items-center gap-2">
          {chat?.status === 'wait_for_human_input' && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleHumanInput('\n')}
              >
                <Icons.enter className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleHumanInput('exit')}
              >
                <Icons.exit className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button
            variant="default"
            size="icon"
            disabled={
              (!message.trim() && chat?.status !== 'wait_for_human_input') ||
              disabled ||
              isResetting
            }
            className="h-7 w-7"
            onClick={chat?.status !== 'ready' ? handleAbort : handleSubmit}
          >
            {isUpdating ? (
              <Icons.stop className="w-4 h-4 text-red-500" />
            ) : (
              <Icons.send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};
