'use client';

import { useTranslations } from 'next-intl';
import PublicFlowList from '../components/PublicFlowList';

// standalone means this is not a child of Popover component
const GalleryPage = ({ onLoad: _onLoad }: any) => {
  const t = useTranslations('page.Gallery');
  return (
    <div className="flex flex-col w-full h-full gap-2 p-2 overflow-y-auto">
      <title>Gallery | FlowGen</title>
      <div className="flex items-center gap-2 text-sm font-bold p-2">
        <span>{t('select-flow')}</span>
      </div>
      <div className="divider" />
      <PublicFlowList action="flow" />
    </div>
  );
};

export default GalleryPage;
