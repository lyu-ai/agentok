'use client';
import { ToolCard } from '@/components/tool/tool-card';
import { useState } from 'react';
import { ToolConfig } from '@/components/tool/tool-config';
import { usePublicTools, useTools } from '@/hooks';
import { faker } from '@faker-js/faker';
import { useRouter } from 'next/navigation';
import { genId } from '@/lib/id';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const NewToolCard = () => {
  const router = useRouter();
  const { createTool, isCreating } = useTools();

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
      toast({ title: 'Failed to create tool' });
      return;
    }
    router.push(`/tools/${tool.id}`);
  };
  return (
    <Button
      variant="outline"
      onClick={handleCreate}
      className="group flex flex-col min-h-48 items-center justify-center gap-2 p-3 rounded-md border border-dashed border-base-content/20 cursor-pointer hover:bg-base-content/10 hover:shadow-box hover:shadow-gray-700"
    >
      <div className="flex flex-col items-center gap-2">
        {isCreating && <div className="loading loading-sm" />}
        {!isCreating && (
          <Icons.tool className="w-8 h-8 flex-shrink-0 group-hover:scale-125 transform transition duration-700 ease-in-out group-hover:text-primary" />
        )}
        <div className="text-base font-bold">New Tool</div>
      </div>
    </Button>
  );
};

const Page = () => {
  const { tools: publicTools } = usePublicTools();
  const { tools: allTools } = useTools();
  const customTools = allTools.filter((tool) => !tool.is_public);
  const [filter, setFilter] = useState<'all' | 'public' | 'custom'>('all');
  const [activeTool, setActiveTool] = useState<any>(null);

  const handleSelect = (tool: any) => {
    setActiveTool(tool);
  };

  return (
    <div className="drawer drawer-end">
      <div className="drawer-content flex flex-col p-2 gap-4">
        <div className="flex items-center gap-4 p-2 border-b border-base-content/10">
          <Icons.tool className="w-12 h-12" />
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-bold">Tools</div>
            <div className="">
              Manage your custom tools and discover public tools
            </div>
          </div>
        </div>
        {['all', 'public'].includes(filter) && publicTools.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="text-lg font-bold">Public Tools</div>
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
            <div className="text-lg font-bold">Custom Tools</div>
            <div className="text-sm text-base-content/50">
              Create and manage your own custom tools
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
      <ToolConfig
        open={!!activeTool}
        onOpenChange={setActiveTool}
        tool={activeTool}
      />
    </div>
  );
};

export default Page;
