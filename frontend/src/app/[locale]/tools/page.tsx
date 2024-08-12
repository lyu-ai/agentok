'use client';
import { useTranslations } from 'next-intl';
import ToolCard from './components/ToolCard';
import { useState } from 'react';
import ToolConfig from './components/ToolConfig';
import { usePublicTools, useTools } from '@/hooks';
import { RiHammerFill, RiHammerLine, RiToolsFill } from 'react-icons/ri';
import { faker } from '@faker-js/faker';
import { useRouter } from 'next/navigation';
import { genId } from '@/utils/id';
import { toast } from 'react-toastify';

const NewToolCard = () => {
  const router = useRouter();
  const { tools, createTool, isCreating, deleteTool, isDeleting } = useTools();
  const t = useTranslations('page.Tools');
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
  return (
    <button
      onClick={handleCreate}
      className="group flex flex-col min-h-48 items-center justify-center gap-2 p-3 rounded-md border border-dashed border-base-content/20 cursor-pointer hover:bg-base-content/10 hover:shadow-box hover:shadow-gray-700"
    >
      <div className="flex flex-col items-center gap-2">
        {isCreating && <div className="loading loading-sm" />}
        {!isCreating && (
          <RiHammerLine className="w-8 h-8 flex-shrink-0 group-hover:scale-125 transform transition duration-700 ease-in-out group-hover:text-primary" />
        )}
        <div className="text-base font-bold">{t('new-tool')}</div>
      </div>
    </button>
  );
};

const Page = () => {
  const t = useTranslations('page.Tools');
  const { tools: publicTools } = usePublicTools();
  const { tools: customTools } = useTools();
  const [filter, setFilter] = useState<'all' | 'public' | 'custom'>('all');
  const [activeTool, setActiveTool] = useState<any>(null);

  const handleSelect = (tool: any) => {
    setActiveTool(tool);
  };

  return (
    <div className="drawer drawer-end">
      <input
        type="checkbox"
        id="drawer-tool-config"
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-col p-2 gap-4">
        <div className="flex items-center gap-4 p-2 border-b border-base-content/10">
          <RiHammerLine className="w-12 h-12" />
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">{t('title')}</div>
            <div className="">{t('description')}</div>
          </div>
        </div>
        {/* <div className="flex items-center justify-start w-full gap-2">
          <div role="tablist" className="tabs tabs-sm tabs-boxed p-1 gap-1">
            {["all", "public", "custom"].map((item, index) => (
              <a
                role="tab"
                key={index}
                onClick={() => setFilter(item as any)}
                className={clsx("min-w-24 tab", {
                  "tab-active": item === filter,
                })}
              >
                {t(item)}
              </a>
            ))}
          </div>
        </div> */}
        {['all', 'public'].includes(filter) && publicTools.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold">{t('public-tools')}</div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {publicTools.map((tool, index) => (
                <ToolCard
                  tool={tool}
                  key={index}
                  selected={activeTool?.id === tool.id}
                  onClick={() => handleSelect(tool)}
                  htmlFor="drawer-tool-config"
                  className="drawer-button"
                />
              ))}
            </div>
          </div>
        )}
        {['all', 'custom'].includes(filter) && (
          <div className="flex flex-col gap-4">
            <div className="text-lg font-bold">{t('custom-tools')}</div>
            <div className="text-sm text-base-content/50">
              {t('custom-tools-description')}
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <NewToolCard />
              {customTools.map((tool, index) => (
                <ToolCard
                  tool={tool}
                  key={index}
                  onClick={() => handleSelect(tool)}
                  selected={activeTool?.id === tool.id}
                  htmlFor="drawer-tool-config"
                  className="drawer-button"
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="drawer-side z-20">
        <label htmlFor="drawer-tool-config" className="drawer-overlay"></label>
        <div className="w-80 lg:w-96 h-full bg-base-100">
          {activeTool && <ToolConfig tool={activeTool} />}
        </div>
      </div>
    </div>
  );
};

export default Page;
