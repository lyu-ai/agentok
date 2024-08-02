import { Float } from '@headlessui-float/react';
import { Popover, PopoverButton, PopoverPanel, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { GoPlus } from 'react-icons/go';
import { useTranslations } from 'next-intl';
import { useChats, useProjects, useTemplates } from '@/hooks';
import { Tab } from '@headlessui/react';
import { Tooltip } from 'react-tooltip';
import { useRouter } from 'next/navigation';

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
    <TabGroup>
      <TabList className="tabs tabs-bordered flex rounded-xl p-1 flex-0">
        {chatSources.map(({ type }) => (
          <Tab
            key={type}
            className={({ selected }) =>
              clsx(
                'tab w-full text-sm hover:text-primary',
                selected ? 'tab-active text-primary' : 'text-base-content'
              )
            }
          >
            {t(type)}
          </Tab>
        ))}
      </TabList>
      <TabPanels className="flex flex-col flex-1 w-full">
        {chatSources.map(({ type, data, isLoading }) => (
          <TabPanel
            key={type}
            className={clsx(
              'flex flex-wrap justify-center rounded-xl p-2 gap-2 '
            )}
          >
            {data?.map((sourceItem: any) => (
              <PopoverButton
                key={`${type}-${sourceItem.id}`}
                onClick={() =>
                  createChat(sourceItem.id, type).then(chat =>
                    router.push(`/chat?id=${chat.id}`)
                  )
                }
                className="w-56 flex flex-col items-start gap-2 text-sm rounded p-2 border backdrop-blur-md border-base-content/5 bg-base-content/10 hover:shadow-box hover:bg-base-content/40 hover:border-base-content/30"
              >
                <span className="line-clamp-1 text-sm text-left font-bold">
                  {sourceItem.name}
                </span>
                <span className="h-8 line-clamp-2 text-xs text-left text-base-content/60 font-normal break-all">
                  {sourceItem.description || '(No description)'}
                </span>
              </PopoverButton>
            ))}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};

const ChatListButton = ({ className }: any) => {
  const t = useTranslations('component.ChatListButton');
  return (
    <Popover>
      <Float
        placement="bottom-start"
        offset={4}
        shift
        enter="transition ease-out duration-300"
        enterFrom="transform scale-0 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-0 opacity-0"
      >
        <PopoverButton>
          <div
            className={clsx(
              className,
              'btn btn-sm btn-primary btn-circle flex items-center gap-2'
            )}
            data-tooltip-id="chatlist-tooltip"
            data-tooltip-content={t('from-template-tooltip')}
          >
            <GoPlus className="w-4 h-4" />
          </div>
        </PopoverButton>
        <PopoverPanel className="origin-top-left w-[500px] h-[480px] overflow-y-auto shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-700/90 text-base-content border border-gray-600">
          <ChatListPanel />
        </PopoverPanel>
      </Float>
      <Tooltip id="chatlist-tooltip" />
    </Popover>
  );
};

export default ChatListButton;
