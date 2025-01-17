import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Icons } from '../icons';
import { FlowCanvas } from './flow-canvas';
import { ChatPane } from '../chat/chat-pane';
import { FlowConfig } from './flow-config';
import { JsonViewer } from './json';
import { useEdges, useNodes } from '@xyflow/react';
import { useState, useEffect } from 'react';
import { useChats } from '@/hooks';
import { ChatLogPane } from '../chat/chat-logs';
import { PythonViewer } from './python';

export const FlowEditor = ({ projectId }: { projectId: number }) => {
  const [mode, setMode] = useState<'flow' | 'python'>('flow');
  const { chats } = useChats();
  const nodes = useNodes();
  const edges = useEdges();
  const selectedNode = nodes.find((node) => node.selected);
  const selectedEdge = edges.find((edge) => edge.selected);
  const [activeChatId, setActiveChatId] = useState(-1);
  useEffect(() => {
    const existingChat = chats.findLast(
      (chat) => chat.from_project === projectId
    );
    setActiveChatId(existingChat?.id || -1);
  }, [projectId, chats]);

  const handleModeChange = (mode: 'flow' | 'python') => {
    setMode(mode);
  };

  return (
    <div className="flex h-[calc(100vh-var(--header-height))]">
      <ResizablePanelGroup direction="horizontal" className="flex h-full">
        <ResizablePanel
          className="h-[calc(100vh-var(--header-height))]"
          defaultSize={70}
          minSize={30}
        >
          <Tabs defaultValue="flow" className="relative flex flex-col h-full">
            <TabsContent value="flow" className="flex-1 overflow-auto mt-0">
              <FlowCanvas
                projectId={projectId}
                onModeChange={handleModeChange}
              />
            </TabsContent>
            <TabsContent value="python" className="flex-1 overflow-auto mt-0">
              <PythonViewer projectId={projectId} />
            </TabsContent>
            <TabsContent value="code" className="flex-1 overflow-auto mt-0">
              <JsonViewer projectId={projectId} />
            </TabsContent>
            <TabsList className="absolute top-0 right-0 flex items-center rounded-none rounded-bl-md border-b border-l justify-start">
              <TabsTrigger value="flow" className="flex items-center gap-2">
                <Icons.project className="w-4 h-4" />
                <span className="hidden md:block text-sm">Flow</span>
              </TabsTrigger>
              <TabsTrigger value="python" className="flex items-center gap-2">
                <Icons.python className="w-4 h-4" />
                <span className="hidden md:block text-sm">Code</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Icons.braces className="w-4 h-4" />
                <span className="hidden md:block text-sm">Data</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={25}>
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <TabsList className="flex items-center justify-start w-full rounded-none border-b shrink-0">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Icons.chat className="w-4 h-4" />
                <span className="hidden md:block text-sm">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Icons.config className="w-4 h-4" />
                <span className="hidden md:block text-sm">Properties</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <Icons.logs className="w-4 h-4" />
                <span className="hidden md:block text-sm">Logs</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="config" className="flex-1 overflow-auto">
              <FlowConfig
                projectId={projectId}
                nodeId={selectedNode?.id}
                edgeId={selectedEdge?.id}
              />
            </TabsContent>
            <TabsContent value="chat" className="flex-1 overflow-auto mt-0">
              <ChatPane projectId={projectId} chatId={activeChatId} />
            </TabsContent>
            <TabsContent value="logs" className="flex-1 overflow-auto">
              <ChatLogPane chatId={activeChatId} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
