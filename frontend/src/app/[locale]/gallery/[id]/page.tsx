'use client';

import { useTranslations } from 'next-intl';
import { TemplateBlock } from '../../components/TemplateList';
import { useTemplates } from '@/hooks';
import { useEffect, useState } from 'react';

// standalone means this is not a child of Popover component
const GalleryDetailPage = ({ params }: { params: { id: string } }) => {
  const t = useTranslations('page.Gallery');
  const { templates, isLoading, isError } = useTemplates();
  const [template, setTemplate] = useState<any>();
  const [index, setIndex] = useState<number>(0);
  useEffect(() => {
    if (isLoading) return;
    if (params?.id) {
      const index = templates.findIndex(
        (template: any) => template.id === params.id
      );
      console.log('foundIndex', index);
      if (index >= 0) {
        setTemplate(templates[index]);
        setIndex(index);
      }
    }
  }, [params?.id, templates, isLoading]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        <div className="loading loading-bars text-primary" />
      </div>
    );
  }

  if (isError || !template) {
    return (
      <div className="flex w-full h-full justify-center items-center">
        {isError}
      </div>
    );
  }

  console.log('template', template);

  return (
    <div className="relative flex flex-col w-full h-full gap-2 p-2 overflow-y-auto items-center">
      <title>Gallery | FlowGen</title>
      <div className="flex flex-col items-center justify-center gap-2 text-sm font-bold p-2">
        <span className="text-5xl font-bold p-4">
          {t('select-template-title')}
        </span>
        <span className="text-lg p-4">{t('select-flow')}</span>
      </div>
      <TemplateBlock template={template} index={index} className="w-[480px]" />
    </div>
  );
};

export default GalleryDetailPage;
