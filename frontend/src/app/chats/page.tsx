'use client';

import { useRouter } from 'next/navigation';
import { useChats, useProjects } from '@/hooks';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import { Project } from '@/store/projects';
import { Loading } from '@/components/loader';
import { useEffect } from 'react';

function ChatCard({ project }: { project: Project }) {
  const router = useRouter();
  const { createChat, isCreating } = useChats();
  const onStartChat = async () => {
    try {
      const chat = await createChat(project.id, 'project');
      router.push(`/chats/${chat.id}`);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to start chat',
      });
    }
  };
  return (
    <div
      key={project.id}
      className="group relative flex flex-col w-full items-start gap-1 p-4 pb-12 h-full cursor-pointer p-4 bg-background border border-muted-foreground/10 hover:border-muted-foreground/20 hover:shadow-sm rounded-xl"
      onClick={onStartChat}
    >
      <span className="flex items-center gap-2 line-clamp-1 text-sm text-left font-bold">
        <Icons.project className="w-4 h-4" />
        {project.name}
      </span>
      <span className="line-clamp-2 text-xs text-left break-all">
        {project.description || '(No description)'}
      </span>
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Link href={`/projects/${project.id}`}>
            <Button variant="ghost" size="icon" className="w-6 h-6">
              <Icons.edit className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="default"
            size="sm"
            className="h-6 bg-primary/50 group-hover:bg-primary/70 hover:bg-primary"
            onClick={onStartChat}
            disabled={isCreating}
          >
            {!isCreating && <Icons.chat className="w-4 h-4" />}
            {isCreating && <Icons.spinner className="animate-spin h-4 w-4" />}
            <span className="text-xs">Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const router = useRouter();
  const { chats, isLoading } = useChats();
  const { projects } = useProjects();
  useEffect(() => {
    if (chats.length > 0) {
      router.replace(`/chats/${chats[0].id}`);
    }
  }, [chats]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-muted">
      <h1 className="text-2xl font-bold p-4">Chats</h1>
      <div className="flex flex-col w-full p-4">
        Choose one of your projects to start chatting.
      </div>
      <ScrollArea className="h-[calc(100vh-var(--header-height)-2rem)] w-full p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {projects.map((project) => (
            <ChatCard key={project.id} project={project} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
