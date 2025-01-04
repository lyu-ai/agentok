import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Icons } from "../icons";
import { FlowCanvas } from "./flow-canvas";
import { ChatPane } from "../chat/chat-pane";
import { FlowConfig } from "./config";
import { JsonViewer } from "./json";
import { useReactFlow } from "@xyflow/react";

export const FlowEditor = ({ projectId }: { projectId: number }) => {
  const { getNodes, getEdges } = useReactFlow();
  const nodes = getNodes();
  const edges = getEdges();
  const selectedNode = nodes.find(node => node.selected);
  const selectedEdge = edges.find(edge => edge.selected);

  return (
    <div className="flex h-[calc(100vh-var(--header-height))]">
      <ResizablePanelGroup direction="horizontal" className="flex h-full">
        <ResizablePanel className="h-[calc(100vh-var(--header-height))]" defaultSize={70}>
          <FlowCanvas projectId={projectId} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={30}>
          <Tabs defaultValue="config" className="flex flex-col h-full">
            <TabsList className="flex items-center justify-start w-full rounded-none border-b shrink-0">
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Icons.settings className="w-4 h-4" />
                <span className="text-sm">Config</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Icons.node className="w-4 h-4" />
                <span className="text-sm">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="nodes" className="flex items-center gap-2">
                <Icons.braces className="w-4 h-4" />
                <span className="text-sm">Data</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="config" className="flex-1 overflow-auto p-2">
              <FlowConfig
                nodeId={selectedNode?.id}
                edgeId={selectedEdge?.id}
              />
            </TabsContent>
            <TabsContent value="chat" className="flex-1 overflow-auto p-2">
              <ChatPane chatId={-1} />
            </TabsContent>
            <TabsContent value="nodes" className="flex-1 overflow-auto">
              <JsonViewer projectId={projectId} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
