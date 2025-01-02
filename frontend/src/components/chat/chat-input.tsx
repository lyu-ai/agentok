'use client';

import { useCallback, useRef, useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onAbort?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ChatInput = ({
  onSubmit,
  onAbort,
  loading,
  disabled,
  className,
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || loading || disabled) return;
      onSubmit(message);
      setMessage('');
    },
    [message, loading, disabled, onSubmit]
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

  return (
    <form
      className={cn('flex items-end gap-2', className)}
      onSubmit={handleSubmit}
    >
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter message to start chat ..."
        className="min-h-[44px] w-full resize-none bg-transparent"
        disabled={disabled}
      />
      <div className="flex items-center gap-2">
        {loading && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onAbort}
            className="h-[44px]"
          >
            <Icons.stop className="w-4 h-4" />
          </Button>
        )}
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          disabled={!message.trim() || disabled}
          className="h-[44px]"
        >
          <Icons.send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};
