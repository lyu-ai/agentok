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
  sampleMessages?: string[];
  className?: string;
}

export const ChatInput = ({
  onSubmit,
  onAbort,
  loading,
  disabled,
  sampleMessages,
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
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        {loading && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onAbort}
            className="h-7 w-7"
          >
            <Icons.stop className="w-4 h-4" />
          </Button>
        )}
        <Button
          type="submit"
          variant="default"
          size="icon"
          disabled={!message.trim() || disabled}
          className="h-7 w-7"
        >
          <Icons.send className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};
