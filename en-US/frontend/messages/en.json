'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { GoAlertFill, GoX } from 'react-icons/go';
import { useTranslations } from 'next-intl';
import FlowList from '../components/FlowList';

// standalone means this is not a child of Popover component
const GalleryPage = ({ onLoad: _onLoad }: any) => {
  const t = useTranslations('page.Gallery');
  const SecurityAlert = () => {
    const [hideAlert, setHideAlert] = useState(false);
    return (
      <div
        className={clsx(
          'group relative flex flex-col border border-yellow-500/50 rounded-md gap-2 p-2 text-sm text-yellow-500/80 bg-yellow-500/20 my-1',
          { hidden: hideAlert }
        )}
      >
        <div className="flex items-center gap-2">
          <GoAlertFill className="w-5 h-5" />
          <span className="font-bold">{t('warning-title')}</span>
        </div>
        <span>{t('warning-content')}</span>
        <div className="absolute right-1 top-1 hidden group-hover:block">
          <button
            className="btn btn-xs btn-square btn-ghost"
            onClick={() => setHideAlert(true)}
          >
            <GoX className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full gap-2 p-2 overflow-y-auto">
      <title>Gallery | FlowGen</title>
      {/* <SecurityAlert /> */}
      <div className="flex items-center gap-2 text-sm font-bold p-2">
        <span>{t('select-flow')}</span>
      </div>
      <div className="divider" />
      <FlowList action="flow" />
    </div>
  );
};

export default GalleryPage;
