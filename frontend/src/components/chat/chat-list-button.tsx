import { Icons } from '@/components/icons';
import { useChats } from '@/hooks';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChatListPanel } from './chat-list-panel';

export const ChatListButton = () => {
  const router = useRouter();
  const { createChat, isCreating } = useChats();

  const handleAddChat = (id: number, source: 'project' | 'template') => {
    createChat(id, source).then((chat) => router.push(`/chats/${chat.id}`));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="w-7 h-7">
          {isCreating ? (
            <Icons.spinner className="w-4 h-4 shrink-0 animate-spin" />
          ) : (
            <Icons.add className="w-4 h-4 shrink-0" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[500px] h-full overflow-hidden p-0"
      >
        <ChatListPanel onAdd={handleAddChat} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
