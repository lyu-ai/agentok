'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Card } from '../ui/card';
import { useChats } from '@/hooks';
import { ScrollArea } from '../ui/scroll-area';

interface ChatListProps {
  className?: string;
}

export const ChatList = ({ className }: ChatListProps) => {
  const router = useRouter();
  const {
    activeChatId,
    chats,
    updateChat,
    isUpdating,
    deleteChat,
    isDeleting,
  } = useChats();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleEditName = useCallback(
    async (chatId: number) => {
      if (!editingName.trim()) return;
      try {
        await updateChat(chatId, { name: editingName });
      } catch (error) {
        console.error('Error updating chat name:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to update chat name',
        });
        return;
      }
      setEditingId(null);
      setEditingName('');
    },
    [editingName, updateChat]
  );

  const handleDeleteChat = useCallback(
    async (chatId: number) => {
      try {
        const chatIndex = chats.findIndex((chat) => chat.id === chatId);
        const newChatId =
          chatIndex === chats.length - 1
            ? chats[chatIndex - 1]?.id
            : chats[chatIndex + 1]?.id;

        await deleteChat(chatId);

        if (activeChatId === chatId) {
          router.replace(newChatId ? `/chats/${newChatId}` : '/chat');
        }
      } catch (error) {
        console.error('Error deleting chat:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete chat',
        });
      }
    },
    [deleteChat, chats, activeChatId, router]
  );

  return (
    <ScrollArea className={cn('flex flex-col h-full p-1 w-full', className)}>
      {chats.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-sm text-muted-foreground">No Chat Yet</div>
        </div>
      ) : (
        <div className="flex flex-col gap-1 pr-2">
          {chats.map((chat) => (
            <Card
              key={chat.id}
              onClick={() => router.push(`/chats/${chat.id}`)}
              className={cn(
                'relative flex items-center gap-2 p-2 border-transparent bg-transparent shadow-none hover:bg-primary hover:text-primary-foreground rounded-md group cursor-pointer',
                activeChatId === chat.id &&
                  'bg-primary/80 text-primary-foreground hover:bg-primary'
              )}
            >
              {editingId === chat.id ? (
                <div className="flex items-center gap-1 flex-1">
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditName(chat.id);
                      } else if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditingName('');
                      }
                    }}
                    className="h-7 w-full text-xs outline-none"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7"
                    onClick={() => handleEditName(chat.id)}
                  >
                    <Icons.check className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="group flex-1 justify-start">
                  <span className="text-sm line-clamp-1">
                    {chat.name ||
                      `Chat with ${chat.from_project || chat.from_template}`}
                  </span>
                  <div
                    className={cn(
                      'hidden group-hover:flex absolute p-2 justify-end right-0 top-0 bottom-0 items-center gap-2'
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-5 h-5 text-muted"
                      onClick={() => {
                        setEditingId(chat.id);
                        setEditingName(chat.name || '');
                      }}
                    >
                      {isUpdating ? (
                        <Icons.spinner className="w-3 h-3 animate-spin" />
                      ) : (
                        <Icons.edit className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-5 h-5"
                      onClick={() => handleDeleteChat(chat.id)}
                    >
                      {isDeleting ? (
                        <Icons.spinner className="w-3 h-3 animate-spin text-red-500" />
                      ) : (
                        <Icons.trash className="w-3 h-3 text-red-500" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};
