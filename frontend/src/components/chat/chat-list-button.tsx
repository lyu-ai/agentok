import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { useChats, useProjects, useTemplates } from '@/hooks';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

const ChatListPanel = ({ onAdd }: any) => {
  const { projects, isLoading: isLoadingProjects } = useProjects();
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
    <Tabs defaultValue="project" className="w-full h-full p-0">
      <TabsList className="w-full flex justify-start rounded-none">
        <TabsTrigger value="project">Projects</TabsTrigger>
        <TabsTrigger value="template">Templates</TabsTrigger>
      </TabsList>
      {(['project', 'template'] as const).map((source, index) => (
        <TabsContent value={source} key={source} className="mt-0 p-0 ">
          <ScrollArea className="h-[calc(100vh-9rem)] w-full">
            <div className="grid grid-cols-2 gap-1 p-1">
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
                    <span className="line-clamp-2 text-xs text-left break-all">
                      {sourceItem.description || '(No description)'}
                    </span>
                  </Button>
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export const ChatListButton = () => {
  const router = useRouter();
  const { createChat, isCreating } = useChats();

  const handleAddChat = (id: number, source: 'project' | 'template') => {
    createChat(id, source).then((chat) => router.push(`/chat?id=${chat.id}`));
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
        className="w-[500px] overflow-hidden p-0"
      >
        <ChatListPanel onAdd={handleAddChat} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
