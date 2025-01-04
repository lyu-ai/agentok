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
          if (newChatId) {
            router.replace(`/chat?id=${newChatId}`);
          }
        }
      } catch (error) {
        console.error('Error deleting chat:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete chat',
        });
        return;
      }
    },
    [deleteChat]
  );

  return (
    <ScrollArea className={cn('flex flex-col h-full p-1 w-full', className)}>
      {chats.length === 0 ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-sm text-muted-foreground">No Chat Yet</div>
        </div>
      ) : (
        chats.map((chat) => (
          <Card
            key={chat.id}
            onClick={() => router.push(`/chat?id=${chat.id}`)}
            className={cn(
              'flex items-center gap-2 p-2 border-transparent hover:bg-muted rounded-md group cursor-pointer',
              activeChatId === chat.id &&
                'bg-primary text-primary-foreground hover:bg-primary/90'
            )}
          >
            {editingId === chat.id ? (
              <div className="flex items-center gap-2 flex-1">
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
                  className="h-8"
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
              <>
                <div className="flex-1 justify-start text-sm">
                  {chat.name ||
                    `Chat with ${chat.from_project || chat.from_template}`}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 w-7 h-7"
                  onClick={() => {
                    setEditingId(chat.id);
                    setEditingName(chat.name || '');
                  }}
                >
                  {isUpdating ? (
                    <Icons.spinner className="w-4 h-4 animate-spin" />
                  ) : (
                    <Icons.edit className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 w-7 h-7"
                  onClick={() => handleDeleteChat(chat.id)}
                >
                  {isDeleting ? (
                    <Icons.spinner className="w-4 h-4 animate-spin text-red-500" />
                  ) : (
                    <Icons.trash className="w-4 h-4 text-red-500" />
                  )}
                </Button>
              </>
            )}
          </Card>
        ))
      )}
    </ScrollArea>
  );
};
