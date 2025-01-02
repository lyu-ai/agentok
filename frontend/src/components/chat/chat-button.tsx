'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

interface ChatButtonProps {
  status: 'online' | 'offline';
  onClick?: () => void;
  className?: string;
}

export const ChatButton = ({ status, onClick, className }: ChatButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={onClick}
      title={status === 'online' ? 'Chat is active' : 'Start new chat'}
    >
      {status === 'online' ? (
        <Icons.robotActive className="w-5 h-5" />
      ) : (
        <Icons.robot className="w-5 h-5" />
      )}
    </Button>
  );
};
