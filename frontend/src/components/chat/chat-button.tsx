'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';

interface ChatButtonProps {
  status: 'online' | 'offline';
  onClick?: () => void;
  className?: string;
}

export const ChatButton = ({ status, onClick, className }: ChatButtonProps) => {
  const t = useTranslations('component.ChatButton');

  return (
    <Button
      variant="ghost"
      size="icon"
      className={className}
      onClick={onClick}
      title={t(status)}
    >
      {status === 'online' ? (
        <Icons.robotActive className="w-5 h-5" />
      ) : (
        <Icons.robot className="w-5 h-5" />
      )}
    </Button>
  );
};
