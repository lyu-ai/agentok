'use client';
import clsx from 'clsx';
import { PropsWithChildren, use, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { genId } from '@/lib/id';
import { useTools } from '@/hooks';
import Link from 'next/link';
import { faker } from '@faker-js/faker';
import { Icons } from '@/components/icons';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

const ToolItem = ({ tool, onDelete, selected, ...props }: any) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (e: any) => {
    e.stopPropagation();
    setIsDeleting(true);
    onDelete && (await onDelete(tool).finally(() => setIsDeleting(false)));
  };

  return (
    <Card
      className={cn(
        'relative group w-full flex flex-col border gap-1 p-2 rounded-md cursor-pointer hover:bg-muted-foreground/10',
        selected
          ? 'bg-muted-foreground/20 border-muted-foreground/30'
          : 'border-transparent'
      )}
      {...props}
    >
      <div className="font-bold text-muted-foreground">{tool.name}</div>
      <div className="text-xs text-muted-foreground/50 w-full line-clamp-2">
        {tool.description}
      </div>
      <div className="absolute bottom-1 right-1 hidden group-hover:block">
        {!tool.is_public && (
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={handleDelete}
          >
            {isDeleting ? (
              <Icons.spinner className="w-4 h-4 animate-spin" />
            ) : (
              <Icons.trash className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default function Layout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ id: string }> }>) {
  const { id } = use(params);
  const { tools, createTool, isCreating, deleteTool } = useTools();
  const router = useRouter();
  const pathname = usePathname();

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
      toast({
        title: 'Failed to create tool',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      return;
    }
    router.push(`/tools/${tool.id}`);
  };

  const handleDelete = async (tool: any) => {
    const currentIndex = tools.findIndex((t) => t.id === tool.id);
    let nextTool;

    if (currentIndex !== -1) {
      if (currentIndex < tools.length - 1) {
        nextTool = tools[currentIndex + 1];
      } else if (currentIndex > 0) {
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
    <div className={cn('flex w-full h-full')}>
      <div className="flex flex-col w-80 h-[calc(100vh-var(--header-height))] border-r gap-2">
        <div className="flex items-center justify-between gap-1 w-full p-2 border-b">
          <Link href={`/tools`}>
            <Button variant="ghost" size="icon" className="w-7 h-7">
              <Icons.home className="w-4 h-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="w-7 h-7"
            onClick={handleCreate}
          >
            {isCreating ? (
              <Icons.spinner className="w-4 h-4 animate-spin" />
            ) : (
              <Icons.add className="w-4 h-4" />
            )}
          </Button>
        </div>
        <ScrollArea className="flex flex-col gap-1 w-full h-full p-2">
          {tools.length > 0 ? (
            tools.map((tool: any) => {
              const isSelected = pathname.endsWith(`/tools/${tool.id}`);
              return (
                <ToolItem
                  selected={isSelected}
                  tool={tool}
                  key={tool.id}
                  onDelete={() => handleDelete(tool)}
                  onClick={() => handleSelect(tool)}
                />
              );
            })
          ) : (
            <div className="flex items-center justify-center h-full text-base-content/50">
              No tools
            </div>
          )}
        </ScrollArea>
      </div>
      <ScrollArea className="flex flex-col w-full gap-2 p-2 flex-grow h-[calc(100vh-var(--header-height))]">
        {children}
      </ScrollArea>
    </div>
  );
}
