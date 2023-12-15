import { Float } from '@headlessui-float/react';
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import { GoPlusCircle } from 'react-icons/go';
import { useTranslations } from 'next-intl';
import { useChats, useFlows, useTemplates } from '@/hooks';
import { Tab } from '@headlessui/react';
import { Tooltip } from 'react-tooltip';
import { useRouter } from 'next/navigation';

const ChatListPanel = ({ onAdd }: any) => {
  const t = useTranslations('component.ChatListButton');
  const { flows, isLoading: isLoadingFlows } = useFlows();
  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  const { createChat } = useChats();
  const router = useRouter();
  const chatSources: {
    type: 'flow' | 'template';
    data: any[];
    isLoading: boolean;
  }[] = [
    {
      type: 'flow',
      data: flows,
      isLoading: isLoadingFlows,
    },
    {
      type: 'template',
      data: templates,
      isLoading: isLoadingTemplates,
    },
  ];
  return (
    <>
      <Tab.Group>
        <Tab.List className="tabs tabs-bordered flex rounded-xl p-1">
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
        </Tab.List>
        <Tab.Panels>
          {chatSources.map(({ type, data, isLoading }) => (
            <Tab.Panel
              key={type}
              className={clsx(
                'flex flex-wrap rounded-xl p-2 gap-2 h-[240px] overflow-y-auto w-full h-full'
              )}
            >
              {data.map((sourceItem: any) => (
                <Popover.Button
                  key={`${type}-${sourceItem.id}`}
                  onClick={() =>
                    createChat(sourceItem.id, type).then(chat =>
                      router.push(`/chat/${chat.id}`)
                    )
                  }
                  className="w-36 flex flex-col justify-center gap-2 text-sm rounded p-2 border border-base-content/5 bg-base-content/10 hover:shadow-box hover:bg-base-content/40 hover:text-base-content hover:border-base-content/30"
                >
                  {sourceItem.name}
                </Popover.Button>
              ))}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

const ChatListButton = ({ className, onSelect }: any) => {
  const t = useTranslations('component.ChatListButton');
  const { chats, activeChat, createChat } = useChats();
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
        <Popover.Button>
          <div
            className={clsx(
              className,
              'btn btn-sm btn-primary btn-outline flex items-center gap-2'
            )}
            data-tooltip-id="chatlist-tooltip"
            data-tooltip-content={t('from-template-tooltip')}
          >
            <GoPlusCircle className="w-4 h-4" />
            <span className="text-xs font-bold">{t('new-chat')}</span>
          </div>
        </Popover.Button>
        <Popover.Panel className="origin-top-left w-[480px] h-[480px] shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-700/90 text-base-content border border-gray-600">
          <ChatListPanel />
        </Popover.Panel>
      </Float>
      <Tooltip id="chatlist-tooltip" />
    </Popover>
  );
};

export default ChatListButton;
