import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icons } from '@/components/icons';
import { useTranslations } from 'next-intl';
import { useChats, useProjects, useTemplates } from '@/hooks';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const ChatListPanel = ({ onAdd }: any) => {
  const t = useTranslations('component.ChatListButton');
  const { projects, isLoading: isLoadingProjects } = useProjects();
  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  const { createChat } = useChats();
  const router = useRouter();
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
    <Tabs defaultValue="projects" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="projects">{t('projects')}</TabsTrigger>
        <TabsTrigger value="templates">{t('templates')}</TabsTrigger>
      </TabsList>
      <TabsContent value="projects">
        {chatSources[0].data?.map((sourceItem: any) => (
          <PopoverTrigger key={sourceItem.id} asChild>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() =>
                createChat(sourceItem.id, 'project').then((chat) =>
                  router.push(`/chat?id=${chat.id}`)
                )
              }
            >
              <span className="line-clamp-1 text-sm text-left font-bold">
                {sourceItem.name}
              </span>
              <span className="h-8 line-clamp-2 text-xs text-left text-base-content/60 font-normal break-all">
                {sourceItem.description || '(No description)'}
              </span>
            </Button>
          </PopoverTrigger>
        ))}
      </TabsContent>
      <TabsContent value="templates">
        {chatSources[1].data?.map((sourceItem: any) => (
          <PopoverTrigger key={sourceItem.id} asChild>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() =>
                createChat(sourceItem.id, 'template').then((chat) =>
                  router.push(`/chat?id=${chat.id}`)
                )
              }
            >
              <span className="line-clamp-1 text-sm text-left font-bold">
                {sourceItem.name}
              </span>
              <span className="h-8 line-clamp-2 text-xs text-left text-base-content/60 font-normal break-all">
                {sourceItem.description || '(No description)'}
              </span>
            </Button>
          </PopoverTrigger>
        ))}
      </TabsContent>
    </Tabs>
  );
};

export const ChatListButton = () => {
  const t = useTranslations('component.ChatListButton');
  const router = useRouter();
  const { createChat } = useChats();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full">
          <Icons.add className="w-5 h-5" />
          {t('from-template-tooltip')}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] h-[480px] overflow-y-auto shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-700/90 text-base-content border border-gray-600">
        <ChatListPanel />
      </PopoverContent>
    </Popover>
  );
};
