'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { ChatListPanel } from './chat-list-panel';
import { useChat, useChats } from '@/hooks';
export const ChatPicker = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { activeChatId, createChat, isCreating } = useChats();
  const activeChat = useChat(activeChatId);
  const handleAddChat = async (id: number, source: 'project' | 'template') => {
    try {
      await createChat(id, source).then((chat) =>
        router.push(`/chats/${chat.id}`)
      );
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create chat',
      });
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 text-muted-foreground/80 hover:text-muted-foreground"
          >
            <Icons.agent className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={14}
          className="flex flex-col w-[480px] lg:w-[800px] p-0 h-[calc(100vh-var(--header-height)-2rem)]"
        >
          <ScrollArea className="flex-1">
            <ChatListPanel includeChats={true} onAdd={handleAddChat} />
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="font-bold text-muted-foreground">/</span>
      <Link
        href={`/chats/${activeChatId === -1 ? '' : activeChatId}`}
        className="flex items-center gap-1 text-sm font-medium"
      >
        {activeChat?.chat?.name || 'Chats'}
      </Link>
    </div>
  );
};
