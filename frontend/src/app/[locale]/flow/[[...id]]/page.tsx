'use client';

import { ReactFlowProvider } from 'reactflow';
import Flow from '../../components/Flow';
import { BsInboxes } from 'react-icons/bs';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Page = ({ params }: { params: { id: string } }) => {
  const t = useTranslations('page.Flow');
  return (
    <div className="flex-1 w-full overflow-y-auto">
      <title>Flow | FlowGen</title>
      {params.id ? (
        <ReactFlowProvider>
          <Flow flowId={params.id?.[0]} />
        </ReactFlowProvider>
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <Link
            className="bg-base-content/20 hover:bg-base-content/50 border border-base-content/40 rounded-md cursor-pointer items-center flex flex-col gap-4 p-8"
            href="/flow/__lucky_draw__"
          >
            <BsInboxes className="w-16 h-16" />
            <div className="text-sm">{t('start-from-example')}</div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Page;
