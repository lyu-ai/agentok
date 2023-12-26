'use client';

import { useTranslations } from 'next-intl';
import FlowList from '../components/FlowList';
import { useRouter } from 'next/navigation';
import { useFlows } from '@/hooks';
import TemplateList from '../components/TemplateList';
import Link from 'next/link';
import clsx from 'clsx';
import { RiRobot2Fill } from 'react-icons/ri';

const FlowPage = () => {
  const t = useTranslations('page.Flow');
  const router = useRouter();
  const { createFlow, isCreating } = useFlows();
  const onCreateFlow = async () => {
    await createFlow().then(flow => {
      if (flow) {
        router.push(`/flow/${flow.id}`);
      }
    });
  };

  return (
    <div className="flex flex-col w-full h-full gap-3 p-2">
      <title>Flow | FlowGen</title>
      <div className="flex flex-col items-center justify-between w-full gap-8 px-4 py-8 text-sm font-bold">
        <img src="/logo.svg" className="w-24 h-24" />
        <span className="text-4xl font-bold">{t('flow-tagline')}</span>
        <button
          onClick={onCreateFlow}
          className="btn btn-primary btn-lg px-6 flex gap-2 items-center py-2"
        >
          <RiRobot2Fill
            className={clsx('w-8 h-8', { 'animate-spin': isCreating })}
          />
          {t('new-flow')}
        </button>
      </div>
      <div className="divider">{t('your-flows')}</div>
      <div className="flex justify-center">
        <FlowList />
      </div>
      <div className="divider">{t('start-from-template')}</div>
      <div className="flex justify-center">
        <TemplateList maxCount={3} />
      </div>
      <div className="flex w-full justify-center items-center py-8">
        <Link
          href="/gallery"
          className="btn btn-lg text-lg btn-primary btn-outline"
        >
          {t('more-templates')}
        </Link>
      </div>
    </div>
  );
};
export default FlowPage;
