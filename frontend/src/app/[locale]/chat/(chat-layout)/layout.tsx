'use client';
// NOTE:
// Putting this page into a group (chat-layout) is to avoid the remounting of layout page when switching between
// different /chat/[id], because remounting of layout will only cause the flickering of the list, but also lose the
// scroll position of the chat list.
// Refer to: https://github.com/vercel/next.js/issues/44793#issuecomment-1382458981
import { useChats, useMediaQuery } from '@/hooks';
import ChatListButton from '../../components/ChatListButton';
import { useTranslations } from 'next-intl';
import ChatList from '../../components/ChatList';
import clsx from 'clsx';
import { useEffect, PropsWithChildren, useState } from 'react';
import { GoFilter, GoX } from 'react-icons/go';

const ChatListPane = () => {
  const t = useTranslations('page.Chat');
  const [filter, setFilter] = useState('');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center w-80 justify-between p-2 gap-2">
        <span className="font-bold">{t('chat-sessions')}</span>
        <ChatListButton />
      </div>
      <div className="relative flex items-center w-full px-2 gap-1">
        <GoFilter className="w-5 h-5" />
        <input
          className="flex-1 input input-sm input-bordered rounded font-normal"
          placeholder={t('filter')}
          value={filter}
          autoFocus
          onChange={e => setFilter(e.target.value)}
        />
        <button
          className="absolute right-3 btn btn-xs btn-square btn-ghost"
          onClick={() => setFilter('')}
        >
          <GoX className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col w-full h-full p-1 gap-1 overflow-y-auto overflow-x-hidden">
        <ChatList filter={filter} />
      </div>
    </div>
  );
};

const LayoutPage = ({ children }: PropsWithChildren) => {
  const { sidebarCollapsed, setSidebarCollapsed } = useChats();
  const t = useTranslations('page.Chat');
  const isMediumScreen = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isMediumScreen) {
      setSidebarCollapsed(true); // When screen is medium, collapse the sidebar
    }
  }, [isMediumScreen, setSidebarCollapsed]);

  return (
    <div className="flex w-full h-full">
      <title>Chat | FlowGen</title>
      <div className="flex gap-2 text-sm w-full h-full p-2">
        <div
          className={clsx(
            'z-20 gap-1 text-sm shadow-box shadow-gray-600 rounded-xl bg-gray-700/80 text-base-content border border-gray-600',
            sidebarCollapsed ? 'hidden' : 'md:flex'
          )}
        >
          <ChatListPane />
        </div>
        <div className="z-10 flex flex-1 shadow-box shadow-gray-600 rounded-xl bg-gray-700/80 text-base-content border border-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
};

export default LayoutPage;
