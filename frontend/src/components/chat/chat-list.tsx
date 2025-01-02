'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import useProjectStore from '@/store/projects';
import { useToast } from '@/hooks/use-toast';

interface ChatListProps {
  className?: string;
}

export const ChatList = ({ className }: ChatListProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const { activeProjectId, getProjectById } = useProjectStore();
  const project = activeProjectId > 0 ? getProjectById(activeProjectId) : undefined;

  const [chats, setChats] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const fetchChats = useCallback(async () => {
    if (!project) return;
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching chats:', error);
      return;
    }
    setChats(data);
  }, [project, supabase]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleEditName = useCallback(
    async (chatId: number) => {
      if (!editingName.trim()) return;
      const { error } = await supabase
        .from('chats')
        .update({ name: editingName })
        .eq('id', chatId);
      if (error) {
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
      fetchChats();
    },
    [editingName, fetchChats, supabase]
  );

  const handleDeleteChat = useCallback(
    async (chatId: number) => {
      const { error } = await supabase.from('chats').delete().eq('id', chatId);
      if (error) {
        console.error('Error deleting chat:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete chat',
        });
        return;
      }
      fetchChats();
    },
    [fetchChats, supabase]
  );

  if (!project) {
    return (
      <div className={cn('flex flex-col gap-2 p-2', className)}>
        <div className="text-sm text-muted-foreground">Select a project to start</div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2 p-2', className)}>
      {chats.length === 0 ? (
        <div className="text-sm text-muted-foreground">No Chat Yet.</div>
      ) : (
        chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 group"
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
                  onClick={() => handleEditName(chat.id)}
                >
                  <Icons.check className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="flex-1 justify-start font-normal"
                  onClick={() => router.push(`/chat/${chat.id}`)}
                >
                  {chat.name || `Chat with ${project.name}`}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => {
                    setEditingId(chat.id);
                    setEditingName(chat.name || '');
                  }}
                >
                  <Icons.edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => handleDeleteChat(chat.id)}
                >
                  <Icons.trash className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};
