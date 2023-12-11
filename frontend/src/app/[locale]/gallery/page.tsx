'use client';

import { useTranslations } from 'next-intl';
import TemplateList from '../components/TemplateList';
import { AiOutlineReload } from 'react-icons/ai';
import { useTemplates } from '@/hooks';

// standalone means this is not a child of Popover component
const GalleryPage = ({ onLoad: _onLoad }: any) => {
  const { refresh } = useTemplates();
  const t = useTranslations('page.Gallery');
  return (
    <div className="relative flex flex-col w-full h-full gap-2 p-2 overflow-y-auto">
      <title>Gallery | FlowGen</title>
      <div className="flex flex-col items-center justify-center gap-2 text-sm font-bold p-2">
        <span className="text-5xl font-bold p-4">{t('select-flow-title')}</span>
        <span className="text-lg p-4">{t('select-flow')}</span>
      </div>
      <TemplateList action="flow" />
      <button
        className="absolute top-2 right-2 btn btn-sm btn-ghost btn-square"
        data-tooltip-id="default-tooltip"
        data-tooltip-content={t('refresh')}
        onClick={() => refresh()}
      >
        <AiOutlineReload className="w-4 h-4" />
      </button>
    </div>
  );
};

export default GalleryPage;
