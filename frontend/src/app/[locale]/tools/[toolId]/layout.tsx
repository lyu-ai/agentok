'use client'; // Ensures this file is treated as a client component
import clsx from 'clsx';
import { PropsWithChildren, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { genId } from '@/utils/id';
import { Tooltip } from 'react-tooltip';
import { useTranslations } from 'next-intl';
import { useTools } from '@/hooks';
import { RiDeleteBin4Line, RiFormula, RiHomeGearLine } from 'react-icons/ri';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { faker } from '@faker-js/faker';

const ToolItem = ({ nodeId, tool, onDelete, selected, ...props }: any) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (e: any) => {
    e.stopPropagation();
    setIsDeleting(true);
    onDelete && (await onDelete(tool).finally(() => setIsDeleting(false)));
  };

  return (
    <div
      className={clsx(
        'relative group w-full flex flex-col gap-2 p-3 rounded-md border cursor-pointer hover:bg-base-content/10 hover:shadow-box hover:shadow-gray-700',
        selected
          ? 'shadow-box shadow-gray-600 bg-gray-700/90 border-gray-600'
          : 'border-base-content/10 '
      )}
      {...props}
    >
      <div className="text-base font-bold">{tool.name}</div>
      <div className="text-sm text-base-content/50 w-full line-clamp-2">
        {tool.description}
      </div>
      <div className="absolute bottom-1 right-1 hidden group-hover:block">
        {!tool.is_public && (
          <button
            className="btn btn-xs btn-square btn-ghost hover:text-red-600"
            onClick={handleDelete}
          >
            {isDeleting ? (
              <div className="loading loading-xs" />
            ) : (
              <RiDeleteBin4Line className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const Layout = ({
  children,
  params,
}: PropsWithChildren<{ params: { projectId: string } }>) => {
  const { tools, createTool, isCreating, deleteTool, isDeleting } = useTools();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('tool.Config');

  const handleCreate = async () => {
    const name = faker.word.verb();
    const tool = await createTool({
      id: genId(),
      name: name,
      description: 'Send hello world message.',
      code: `def ${name}(message: str) -> None:\n\
    '''Send hello world message.'''\n\
    print(message)`,
      variables: [],
    });
    if (!tool) {
      toast.error('Failed to create tool');
      return;
    }
    router.push(`/tools/${tool.id}`);
  };

  const handleDelete = async (tool: any) => {
    // Find the index of the tool to be deleted
    const currentIndex = tools.findIndex((t) => t.id === tool.id);

    let nextTool;

    // Determine the next tool based on the position of the deleted tool
    if (currentIndex !== -1) {
      if (currentIndex < tools.length - 1) {
        // If the deleted tool is not the last one, select the next tool
        nextTool = tools[currentIndex + 1];
      } else if (currentIndex > 0) {
        // If the deleted tool is the last one, select the previous tool
        nextTool = tools[currentIndex - 1];
      }
    }

    await deleteTool(tool.id);

    if (nextTool) {
      router.push(`/tools/${nextTool.id}`);
    } else {
      router.push(`/tools`);
    }
  };

  const handleSelect = async (tool: any) => {
    router.push(`/tools/${tool.id}`);
  };

  return (
    <div className={clsx('flex w-full h-full')}>
      <div className="flex flex-col w-80 h-full border-r p-2 gap-2 border-base-content/10">
        <div className="flex items-center gap-1">
          <Link
            href={`/tools`}
            className="btn btn-sm btn-primary btn-square rounded"
            data-tooltip-id="default-tooltip"
            data-tooltip-content={'Back to Tools'}
          >
            <RiHomeGearLine className="w-5 h-5" />
          </Link>
          <button
            className="btn btn-sm btn-primary rounded flex flex-1"
            onClick={handleCreate}
          >
            {isCreating && <div className="loading loading-xs" />}
            <span>{t('new-tool')}</span>
          </button>
        </div>
        <div className="flex flex-col gap-0.5 w-full h-full overflow-y-hidden">
          {tools.length > 0 ? (
            tools.map((tool: any, index: any) => {
              const isSelected = pathname.endsWith(`/tools/${tool.id}`);
              return (
                <ToolItem
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
