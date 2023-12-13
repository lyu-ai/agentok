import { Float } from '@headlessui-float/react';
import { Popover } from '@headlessui/react';
import clsx from 'clsx';
import { IoAddCircle, IoApps } from 'react-icons/io5';
import { useTranslations } from 'next-intl';
import { useFlows, useTemplates } from '@/hooks';
import Link from 'next/link';
import { Tab } from '@headlessui/react';

const ChatListPanel = () => {
  const t = useTranslations('component.ChatListButton');
  const { flows, isLoading: isLoadingFlows } = useFlows();
  const { templates, isLoading: isLoadingTemplates } = useTemplates();
  const chatSources = [
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
        <Tab.List className="tabs tabs-bordered flex rounded-xl bg-blue-900/20 p-1">
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
        <Tab.Panels className="mt-2">
          {chatSources.map(({ type, data, isLoading }) => (
            <Tab.Panel
              key={type}
              className={clsx(
                'flex flex-wrap rounded-xl p-2 gap-2 overflow-y-auto '
              )}
            >
              {isLoading ? (
                <>Loading</>
              ) : (
                data.map((sourceItem: any) => (
                  <Link
                    key={`${type}-${sourceItem.id}`}
                    href={`/chat?source_id=${sourceItem.id}&source_type=${type}`}
                    className="w-36 p-4 border rounded-lg hover:bg-blue-900/20 hover:border-blue-900/40"
                  >
                    {sourceItem.name}
                  </Link>
                ))
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </>
  );
};

const ChatListButton = ({ className, onSelect }: any) => {
  const t = useTranslations('component.ChatListButton');

  return (
    <Popover>
      <Float
        placement="bottom"
        offset={5}
        enter="transition ease-out duration-300"
        enterFrom="transform scale-0 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-0 opacity-0"
      >
        <div className="flex items-center gap-1">
          <div
            className={clsx(
              className,
              'join-item btn btn-sm btn-primary btn-outline flex items-center gap-2'
            )}
            data-tooltip-id="default-tooltip"
            data-tooltip-content={t('new-chat-tooltip')}
          >
            <div className="relative">
              <IoAddCircle className="w-4 h-4" />
            </div>
            <span>{t('new-chat')}</span>
          </div>
          <Popover.Button>
            <div
              className={clsx(
                className,
                'join-item btn btn-sm btn-primary btn-outline flex items-center gap-2'
              )}
              data-tooltip-id="default-tooltip"
              data-tooltip-content={t('from-template-tooltip')}
            >
              <div className="relative">
                <IoApps className="w-4 h-4" />
              </div>
            </div>
          </Popover.Button>
        </div>
        <Popover.Panel className="origin-top-left w-[480px] absolute shadow-box shadow-gray-600 z-50 rounded-xl p-1 gap-2 backdrop-blur-md bg-gray-700/80 text-base-content border border-gray-600 max-h-[80vh]">
          <ChatListPanel />
        </Popover.Panel>
      </Float>
    </Popover>
  );
};

export default ChatListButton;
