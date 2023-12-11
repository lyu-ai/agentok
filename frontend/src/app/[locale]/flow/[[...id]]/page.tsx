'use client';

import { ReactFlowProvider } from 'reactflow';
import Flow from '../../components/Flow';
import { BsInboxes } from 'react-icons/bs';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import FlowList from '../../components/FlowList';
import { useEffect } from 'react';
import { useFlows } from '@/hooks';
import { useRouter } from 'next/navigation';

const Page = ({ params }: { params: { id: string } }) => {
  const t = useTranslations('page.Flow');
  const { createFlow, isCreating } = useFlows();
  const router = useRouter();

  useEffect(() => {
    if (params.id?.[0] === 'new') {
      createFlow().then(flow => flow && router.replace(`/flow/${flow.id}`));
    }
  }, []);

  if (params.id === undefined) {
    return (
      <div className="flex flex-col w-full h-full p-2">
        <div className="flex items-center justify-between w-full gap-2 text-sm font-bold">
          <span>{t('select-flow')}</span>
          <button className="btn btn-sm btn-primary">
            <Link href="/flow/new">{t('new-flow')}</Link>
          </button>
        </div>
        <div className="divider" />
        <FlowList />
      </div>
    );
  }

  if (params.id?.[0] === 'new') {
    return (
      <div className="flex items-center justify-center w-full h-full">
        {isCreating ? (
          <div className="loading loading-primary loading-bars" />
        ) : (
          <div className="flex flex-col gap-2 items-center text-base-content/60">
            <BsInboxes className="w-12 h-12" />
            <div className="btn btn-sm btn-primary">
              <Link href="/flow/new">{t('new-flow')}</Link>
            </div>
          </div>
        )}
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
