import { useChats, useProjects } from '@/hooks';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useTemplates } from '@/hooks';
import { Badge } from '../ui/badge';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
export const ChatListPanel = ({ includeChats, onAdd }: any) => {
  const router = useRouter();
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const { chats, isLoading: isLoadingChats } = useChats();
  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  const chatSources: {
    type: 'project' | 'template';
    data: any[] | undefined;
    isLoading: boolean;
  }[] = [
    {
      type: 'project',
      data: projects,
      isLoading: isLoadingProjects,
    },
    {
      type: 'template',
      data: templates,
      isLoading: isLoadingTemplates,
    },
  ];
  return (
    <Tabs
      defaultValue={includeChats ? 'chat' : 'project'}
      className="w-full h-full p-0"
    >
      <TabsList className="w-full flex justify-start rounded-none">
        {includeChats && <TabsTrigger value="chat">Chats</TabsTrigger>}
        <TabsTrigger value="project">Projects</TabsTrigger>
        <TabsTrigger value="template">Templates</TabsTrigger>
      </TabsList>
      {(['project', 'template'] as const).map((source, index) => (
        <TabsContent value={source} key={source} className="mt-0 p-0 ">
          <ScrollArea className="h-[calc(100vh-var(--header-height)-5rem)] w-full">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 p-1">
              {chatSources[index].data?.map((sourceItem: any) => (
                <DropdownMenuItem key={sourceItem.id} asChild>
                  <Button
                    variant="outline"
                    className="flex flex-col w-full items-start gap-1 p-2 h-full cursor-pointer"
                    onClick={() => onAdd(sourceItem.id, source)}
                  >
                    <span className="line-clamp-1 text-sm text-left font-bold">
                      {sourceItem.name}
                    </span>
                    <span className="line-clamp-1 text-xs text-left truncate w-full">
                      {sourceItem.description || '(No description)'}
                    </span>
                  </Button>
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
      <TabsContent value="chat" className="my-0 p-0 ">
        <ScrollArea className="h-[calc(100vh-var(--header-height)-5rem)] w-full">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-1 p-1">
            {chats.map((chat) => (
              <DropdownMenuItem key={chat.id} className="w-full p-0">
                <Button
                  key={chat.id}
                  variant="ghost"
                  onClick={() => router.push(`/chats/${chat.id}`)}
                  className="flex flex-col items-start h-full w-full gap-3 p-2 border rounded-md bg-muted/50"
                >
                  <span className="line-clamp-1 text-sm text-left font-bold">
                    {chat.name}
                  </span>
                  <div className="flex items-center gap-1 justify-between w-full">
                    <DropdownMenuItem asChild className="w-auto p-0">
                      <div
                        onClick={() =>
                          router.push(
                            chat.from_project
                              ? `/projects/${chat.from_project}`
                              : `/discover/${chat.from_template}`
                          )
                        }
                        className="w-full cursor-pointer hover:bg-muted/50"
                      >
                        <Badge
                          variant="outline"
                          className={cn(
                            'text-xs text-left break-all flex items-center gap-1 bg-red-500/30 hover:bg-red-500/60 border-red-500',
                            chat.from_project &&
                              'bg-blue-500/30 hover:bg-blue-500/50 border-blue-500/50',
                            chat.from_template &&
                              'bg-green-500/30 hover:bg-green-500/50 border-green-500/50'
                          )}
                        >
                          {chat.from_project && (
                            <>
                              <Icons.project className="w-2 h-2" />
                              Project
                            </>
                          )}
                          {chat.from_template && (
                            <>
                              <Icons.compass className="w-2 h-2" />
                              Template
                            </>
                          )}
                          {!chat.from_project && !chat.from_template && (
                            <>
                              <Icons.alert className="w-2 h-2" />
                              No source
                            </>
                          )}
                        </Badge>
                      </div>
                    </DropdownMenuItem>
                    <Badge
                      variant="outline"
                      className="line-clamp-2 text-xs text-left break-all"
                    >
                      {chat.status || 'ready'}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};
