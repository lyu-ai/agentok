'use client';

import { useTranslations } from 'next-intl';
import TemplateList from '../components/TemplateList';

// standalone means this is not a child of Popover component
const Page = () => {
  const t = useTranslations('page.Marketplace');
  return (
    <div className="relative flex flex-col w-full h-full gap-2 p-2 overflow-y-auto">
      <title>Marketplace | Agentok Studio</title>
      <div className="flex flex-col items-center justify-center gap-2 text-sm p-2">
        <span className="text-5xl font-bold p-4">
          {t('select-template-title')}
        </span>
        <span className="text-lg p-4">{t('select-project')}</span>
      </div>
      <TemplateList action="project" />
    </div>
  );
};

export default Page;
