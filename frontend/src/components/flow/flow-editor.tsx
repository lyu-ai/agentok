import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Icons } from '../icons';
import { FlowCanvas } from './flow-canvas';
import { ChatPane } from '../chat/chat-pane';
import { FlowConfig } from './config';
import { JsonViewer } from './json';
import { useReactFlow } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { useChats } from '@/hooks';
import Python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import { ChatConsole } from '../chat/chat-console';

export const FlowEditor = ({ projectId }: { projectId: number }) => {
  const { getNodes, getEdges } = useReactFlow();
  const { chats } = useChats();
  const nodes = getNodes();
  const edges = getEdges();
  const selectedNode = nodes.find((node) => node.selected);
  const selectedEdge = edges.find((edge) => edge.selected);
  const [activeChatId, setActiveChatId] = useState(-1);
  useEffect(() => {
    const existingChat = chats.findLast(
      (chat) => chat.from_project === projectId
    );
    setActiveChatId(existingChat?.id || -1);
  }, [projectId, chats]);

  return (
    <div className="flex h-[calc(100vh-var(--header-height))]">
      <ResizablePanelGroup direction="horizontal" className="flex h-full">
        <ResizablePanel
          className="h-[calc(100vh-var(--header-height))]"
          defaultSize={70}
        >
          <FlowCanvas projectId={projectId} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>
          <Tabs defaultValue="config" className="flex flex-col h-full">
            <TabsList className="flex items-center justify-start w-full rounded-none border-b shrink-0">
              <TabsTrigger value="config" className="flex items-center gap-1">
                <Icons.config className="w-4 h-4" />
                <span className="hidden md:block text-xs">Config</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <Icons.node className="w-4 h-4" />
                <span className="hidden md:block text-xs">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="console" className="flex items-center gap-1">
                <Icons.console className="w-4 h-4" />
                <span className="hidden md:block text-xs">Console</span>
              </TabsTrigger>
              <TabsTrigger value="nodes" className="flex items-center gap-1">
                <Icons.braces className="w-4 h-4" />
                <span className="hidden md:block text-xs">Data</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="config" className="flex-1 overflow-auto p-2">
              <FlowConfig nodeId={selectedNode?.id} edgeId={selectedEdge?.id} />
            </TabsContent>
            <TabsContent value="chat" className="flex-1 overflow-auto p-2">
              <ChatPane projectId={projectId} chatId={activeChatId} />
            </TabsContent>
            <TabsContent value="nodes" className="flex-1 overflow-auto">
              <JsonViewer projectId={projectId} />
            </TabsContent>
            <TabsContent value="console" className="flex-1 overflow-auto">
              <ChatConsole chatId={activeChatId} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
