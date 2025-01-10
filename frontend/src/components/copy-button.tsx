import React, { useState } from 'react';
import { Icons } from '@/components/icons';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

export const CopyButton = ({
  content,
  className,
}: {
  content: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast({
      title: 'Copied',
      description: 'Content has been copied to clipboard',
      variant: 'default',
    });
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const CopyIcon = copied ? Icons.check : Icons.copy;
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('w-7 h-7', className)}
      onClick={() => onCopy()}
    >
      <CopyIcon className="w-4 h-4" />
    </Button>
  );
};
