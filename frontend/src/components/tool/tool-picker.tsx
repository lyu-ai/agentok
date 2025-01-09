import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import { PopoverClose } from '@radix-ui/react-popover';
import { Card } from '../ui/card';
import { usePublicTools, useTools } from '@/hooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
export function ToolPicker({
  onAddTool,
  button,
}: {
  onAddTool: (toolId: any) => void;
  button?: React.ReactNode;
}) {
  const { tools } = useTools();
  const { tools: publicTools } = usePublicTools();
  return (
    <Popover>
      <PopoverTrigger asChild>
        {button ? (
          button
        ) : (
          <Button size="icon" variant="outline" className="w-7 h-7">
            <Icons.add className="w-4 h-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-80 p-0">
        <Tabs defaultValue="tools">
          <TabsList className="flex w-full p-1">
            {[tools, publicTools].map((tools, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className="w-full"
              >
                {index === 0 ? 'Private Tools' : 'Public Tools'}
              </TabsTrigger>
            ))}
          </TabsList>
          {[tools, publicTools].map((tools, index) => (
            <TabsContent
              key={index}
              value={index.toString()}
              className="flex flex-col mt-0 p-2 gap-1"
            >
              {tools.map((tool, index) => (
                <PopoverClose
                  key={index}
                  onClick={() => onAddTool(tool.id)}
                  asChild
                >
                  <Card className="flex flex-col gap-2 p-2 w-full hover:bg-muted cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={tool.logo_url} />
                        <AvatarFallback>
                          {tool.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{tool.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {tool.description}
                    </span>
                  </Card>
                </PopoverClose>
              ))}
              {tools.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 w-full h-48">
                  <span>No tools found</span>
                  <Link href="/tools">
                    <Button variant="outline">Start to Build</Button>
                  </Link>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
