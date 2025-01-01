'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useRef, useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSubmit: (text: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const ChatInput = ({
  onSubmit,
  onStop,
  disabled,
  loading,
  className,
}: ChatInputProps) => {
  const t = useTranslations('component.ChatInput');
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    if (!text.trim()) return;
    onSubmit(text);
    setText('');
  }, [text, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  return (
    <div className={cn('flex items-end gap-2 p-2', className)}>
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0"
        onClick={() => {
          // TODO: Implement image upload
        }}
        disabled={disabled || loading}
      >
        <Icons.image className="w-5 h-5" />
      </Button>
      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t('placeholder')}
        disabled={disabled || loading}
        className="min-h-[40px] max-h-[200px] resize-none"
        rows={1}
      />
      <Button
        variant="ghost"
        size="icon"
        className="flex-shrink-0"
        onClick={loading ? onStop : handleSubmit}
        disabled={disabled || (!loading && !text.trim())}
      >
        {loading ? (
          <Icons.stop className="w-5 h-5" />
        ) : (
          <Icons.send className="w-5 h-5" />
        )}
      </Button>
    </div>
  );
};
