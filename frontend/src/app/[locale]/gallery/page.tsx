'use client';

import { useTranslations } from 'next-intl';
import PublicFlowList from '../components/PublicFlowList';
import { AiOutlineReload } from 'react-icons/ai';
import { usePublicFlows } from '@/hooks';

// standalone means this is not a child of Popover component
const GalleryPage = ({ onLoad: _onLoad }: any) => {
  const { refresh } = usePublicFlows();
  const t = useTranslations('page.Gallery');
  return (
    <div className="flex flex-col w-full h-full gap-2 p-2 overflow-y-auto">
      <title>Gallery | FlowGen</title>
      <div className="flex items-center justify-between gap-2 text-sm font-bold p-2">
        <span>{t('select-flow')}</span>
        <button className="btn btn-sm btn-outline" onClick={() => refresh()}>
          <AiOutlineReload className="w-4 h-4" />
          <span>{t('refresh')}</span>
        </button>
      </div>
      <div className="divider" />
      <PublicFlowList action="flow" />
    </div>
  );
};

export default GalleryPage;
