'use client';

import { ReactFlowProvider } from 'reactflow';
import Flow from '../../components/Flow';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import FlowList from '../../components/FlowList';
import { useEffect } from 'react';
import { useFlows } from '@/hooks';
import { useRouter } from 'next/navigation';
import TemplateList from '../../components/TemplateList';
import { RiRobot2Fill } from 'react-icons/ri';

const Page = ({ params }: { params: { id: string } }) => {
  const t = useTranslations('page.Flow');
  const { createFlow } = useFlows();
  const router = useRouter();

  useEffect(() => {
    if (params.id?.[0] === 'new') {
      createFlow().then(flow => flow && router.replace(`/flow/${flow.id}`));
    }
  }, []);

  if (params.id === undefined) {
    return (
      <div className="flex flex-col w-full h-full gap-3 p-2">
        <div className="flex flex-col items-center justify-between w-full gap-6 px-4 py-8 text-sm font-bold">
          <span className="text-4xl font-bold">{t('flow-tagline')}</span>
          <Link
            href="/flow/new"
            className="btn btn-primary btn-lg px-6 flex gap-2 items-center py-2"
          >
            <RiRobot2Fill className="w-8 h-8" />
            {t('new-flow')}
          </Link>
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
            className="link text-lg link-primary link-hover"
          >
            {t('more-templates')}
          </Link>
        </div>
      </div>
    );
  }

  if (params.id?.[0] === 'new') {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="loading loading-bars loading-primary" />
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <Flow flowId={params.id?.[0]} />
    </ReactFlowProvider>
  );
};

export default Page;
