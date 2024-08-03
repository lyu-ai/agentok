'use client'; // Ensures this file is treated as a client component
import clsx from 'clsx';
import { PropsWithChildren, useEffect, useState } from 'react';
import ToolCard from './components/ToolCard';
import { usePathname, useRouter } from 'next/navigation';
import { genId } from '@/utils/id';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'next-intl';
import { useTools } from '@/hooks';
import {
  RiLayoutGridFill,
} from 'react-icons/ri';
import Link from 'next/link';

const Layout = ({
  children,
  params,
}: PropsWithChildren<{ params: { projectId: string } }>) => {
  const { tools, createTool, isCreating, deleteTool, isDeleting } = useTools();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('tool.Config');

  const handleCreate = async () => {
    await createTool({
          id: genId(),
          name: 'hello',
          description: 'Send hello world message.',
          code: '',
          signatures: [
            {
              id: genId(),
              name: 'message',
              type: 'str',
              description: 'The message to be printed.',
            },
          ],
          variables: [],
        });
  };

  const handleDelete = async (tool: any) => {
    await deleteTool(tool.id);
  };

  const handleSelect = async (tool: any) => {
    router.push(`/tools/${tool.id}`);
  };

  return (
    <div className={clsx('flex w-full h-full')}>
      <div className="flex flex-col w-80 h-full border-r p-2 gap-2 border-base-content/10">
        <div className="flex items-center gap-1">
          <button
            className="btn btn-sm btn-primary rounded flex flex-1"
            onClick={handleCreate}
          >
            {isCreating && (
              <div className="loading loading-xs" />
            )}
            <span>{t('new-tool')}</span>
          </button>
          <Link
            href={`/tools`}
            className="btn btn-sm btn-primary btn-square rounded"
            data-tooltip-id="default-tooltip"
            data-tooltip-content={'Shared Tools'}
          >
            <RiLayoutGridFill className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex flex-col gap-0.5 w-full h-full overflow-y-hidden">
          {tools.length > 0 ? (
            tools.map((tool: any, index: any) => {
              const isSelected = pathname.includes(`/tools/${tool.id}`);
              return (
                <ToolCard
                  selected={isSelected}
                  tool={tool}
                  key={index}
                  onDelete={() => handleDelete(tool)}
                  onClick={() => handleSelect(tool)}
                />
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-base-content/50">
              {t('no-tools')}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full gap-2 p-2 flex-grow h-full overflow-y-auto">
        {children}
      </div>
      <Tooltip id="tool-tooltip" place="bottom" />
    </div>
  );
};

export default Layout;
