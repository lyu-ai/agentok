import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  EdgeChange,
  NodeChange,
  SelectionMode,
  useStoreApi,
  useReactFlow,
  addEdge,
  ConnectionLineType,
  XYPosition,
  Panel,
  useEdgesState,
  useNodesState,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './reactflow.css';
import { nodeTypes, edgeTypes, isConversable } from '@/lib/flow';
import { Icons } from '@/components/icons';
import { useState, useCallback, useRef, useEffect } from 'react';
import { ViewToggle } from './view-toggle';
import { NodeButton } from './node-button';
import { PythonViewer } from './python';
import { JsonViewer } from './json';
import { genId } from '@/lib/id';
import { useChats, useProject, useSettings } from '@/hooks';
import { debounce } from 'lodash-es';
import { ChatPane } from '@/components/chat/chat-pane';
import useProjectStore from '@/store/projects';
import { Chat as ChatType } from '@/store/chats';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { nanoid } from 'nanoid';

const DEBOUNCE_DELAY = 500; // Adjust this value as needed

const useDebouncedUpdate = (projectId: number) => {
  const [isDirty, setIsDirty] = useState(false);
  const { updateProject } = useProject(projectId);
  const { toObject } = useReactFlow();
  const initialLoad = useRef(true);

  const debouncedUpdate = debounce((flow) => {
    updateProject({ flow });
    setIsDirty(false);
  }, DEBOUNCE_DELAY);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    if (isDirty) {
      debouncedUpdate(toObject());
    }

    return () => {
      debouncedUpdate.cancel();
    };
  }, [isDirty, toObject, debouncedUpdate]);

  return { setIsDirty, debouncedUpdate };
};

export const FlowEditor = ({ projectId }: { projectId: number }) => {
  const { project, isLoading, isError } = useProject(projectId);
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const { setIsDirty } = useDebouncedUpdate(projectId);
  const { chats, createChat } = useChats();
  const [mode, setMode] = useState<'main' | 'flow' | 'json' | 'python'>('flow');
  const flowParent = useRef<HTMLDivElement>(null);
  const nodePanePinned = useProjectStore((state) => state.nodePanePinned);
  const [activeChatId, setActiveChatId] = useState<ChatType | undefined>();
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null);

  // Suppress error code 002
  const store = useStoreApi();
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      store.getState().onError = (code, message) => {
        if (code === '002') {
          return;
        }
        console.warn('Workflow warning:', code, message);
      };
    }
  }, []);

  useEffect(() => {
    const initializeProjectFlow = () => {
      if (project?.flow) {
        setNodes(project.flow.nodes);
        setEdges(project.flow.edges);
        setIsDirty(false);
      }
      const existingChat = chats.findLast(
        (chat) => chat.from_project === project?.id
      );
      if (existingChat) {
        setActiveChatId(existingChat);
      }
    };

    initializeProjectFlow();
  }, [projectId]);

  const isGroupType = (type: string) =>
    ['groupchat', 'nestedchat'].includes(type);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const nextNodes = applyNodeChanges(changes, nds);
        console.log('nextNodes', changes, nextNodes);

        changes.forEach((change) => {
          if (change.type === 'position' && 'id' in change) {
            const node = nextNodes.find((n) => n.id === change.id);
            if (node && node.type && !isGroupType(node.type)) {
              const groupNode = nextNodes.find(
                (n) =>
                  n.type && isGroupType(n.type) &&
                  isPositionInsideNode(
                    {
                      x: node.position.x + (node.width ?? 0) / 2,
                      y: node.position.y + (node.height ?? 0) / 2,
                    },
                    n
                  )
              );
              if (groupNode) {
                node.parentId = groupNode.id;
                node.position = {
                  x: node.position.x - groupNode.position.x,
                  y: node.position.y - groupNode.position.y,
                };
                // Move the node to be after the group node in the array
                const nodeIndex = nextNodes.indexOf(node);
                const groupNodeIndex = nextNodes.indexOf(groupNode);
                if (nodeIndex > groupNodeIndex) {
                  nextNodes.splice(nodeIndex, 1);
                  nextNodes.splice(groupNodeIndex + 1, 0, node);
                }
              } else {
                node.parentId = undefined;
              }
            }
          }
        });

        if (changes.some((change) => change.type !== 'select')) {
          setIsDirty(true);
        }
        return nextNodes;
      });
    },
    [setNodes, setIsDirty]
  );

  // Helper function to check if a position is inside a node
  const isPositionInsideNode = (position: XYPosition, node: Node) => {
    return (
      position.x > node.position.x &&
      position.x < node.position.x + (node.width ?? 0) &&
      position.y > node.position.y &&
      position.y < node.position.y + (node.height ?? 0)
    );
  };

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      if (changes.some((change) => change.type !== 'select')) {
        setIsDirty(true);
      }
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setIsDirty]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    if (!flowParent.current) return;

    const flowBounds = flowParent.current.getBoundingClientRect();
    const position = screenToFlowPosition({
      x: event.clientX - flowBounds.left,
      y: event.clientY - flowBounds.top,
    });

    // Find if we're hovering over a group node
    const groupNode = nodes.find(
      (n) =>
        n.type === 'groupchat' &&
        position.x > n.position.x &&
        position.x < (n.position.x + (n.width ?? 0)) &&
        position.y > n.position.y &&
        position.y < (n.position.y + (n.height ?? 0))
    );

    setHoveredGroupId(groupNode?.id || null);
  }, [nodes, screenToFlowPosition, flowParent]);

  const onDragLeave = useCallback(() => {
    setHoveredGroupId(null);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const data = JSON.parse(event.dataTransfer.getData('application/json'));
      console.log('onDrop', data);
      if (!data) {
        console.warn('No data found in onDrop');
        return;
      }

      if (!flowParent.current) {
        console.warn(
          'Unexpected null value of flowParent, drag & drop failed.'
        );
        return;
      }

      const flowBounds = flowParent.current.getBoundingClientRect();
      const position = screenToFlowPosition({
        x: event.clientX - flowBounds.left,
        y: event.clientY - flowBounds.top,
      });

      const { offsetX, offsetY, ...cleanedData } = data;
      const newId = nanoid();
      const newNode: Node = {
        id: `node-${data.id}-${newId}`,
        type: data.id,
        position,
        data: cleanedData,
        selected: true,
        dragHandle: '.drag-handle',
        parentId: undefined,
        style: undefined,
      };

      // Find if we're dropping into a group node
      const groupNode = nodes.find(
        (n) =>
          n.type === 'groupchat' &&
          position.x > n.position.x &&
          position.x < (n.position.x + (n.width ?? 0)) &&
          position.y > n.position.y &&
          position.y < (n.position.y + (n.height ?? 0))
      );

      if (groupNode) {
        // Adjust position to be relative to the group node
        newNode.position = {
          x: position.x - groupNode.position.x,
          y: position.y - groupNode.position.y,
        };
        newNode.parentId = groupNode.id;
        // If the node being dropped is also a group, adjust its size
        if (data.id === 'groupchat') {
          newNode.style = {
            width: Math.min(300, groupNode.width! - 50),
            height: Math.min(200, groupNode.height! - 50)
          };
        }
      }

      setNodes((nds) =>
        nds.map((n) => ({ ...n, selected: false }))
          .concat({
            ...newNode,
            selected: false,
            draggable: true,
            selectable: true,
            focusable: true,
          })
      );
    },
    [nodes, screenToFlowPosition, setNodes, flowParent]
  );

  const onConnect = (params: any) => {
    const sourceNode = nodes.find((nd) => nd.id === params.source);
    const targetNode = nodes.find((nd) => nd.id === params.target);
    const isConverseEdge =
      isConversable(sourceNode) && isConversable(targetNode);
    setEdges((eds) => {
      let newEdges = {
        ...params,
        strokeWidth: 2,
      };
      if (isConverseEdge) {
        newEdges = {
          ...newEdges,
          animated: true,
          type: 'converse',
        };
      }
      return addEdge(newEdges, eds);
    });
  };

  const onAddNode = (type: string, data: any) => {
    const newId = genId();
    const randInt = (max: number) =>
      Math.floor(Math.random() * Math.floor(max));
    const viewportCenter = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const newNode: Node = {
      id: `node-${type}-${newId}`,
      type,
      position: {
        x: viewportCenter.x - 50 + randInt(100),
        y: viewportCenter.y - 100 + randInt(200),
      },
      data,
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const handleStartChat = async () => {
    if (!project) {
      console.warn('Project not found');
      return;
    }
    const existingChat = chats.findLast(
      (chat) => chat.from_project === project.id
    );
    console.log('existingChat', existingChat);
    if (existingChat) {
      setActiveChatId(existingChat);
      return;
    }
    await createChat(project.id, 'project').then((chat) =>
      setActiveChatId(chat)
    );
  };

  if (mode === 'python') {
    return (
      <div className="relative flex w-full h-full">
        <PythonViewer data={project} setMode={setMode} />
      </div>
    );
  } else if (isLoading) {
    return (
      <div className="relative flex w-full h-full items-center justify-center">
        <div className="loading loading-bars text-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative flex w-full h-full items-center justify-center">
        <p className="text-red-500">
          Project load failed {projectId}
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-var(--header-height))]">
      <ResizablePanelGroup direction="horizontal" className="flex h-full">
        <ResizablePanel className="h-[calc(100vh-var(--header-height))]" defaultSize={70}>
          <div
            className="relative flex flex-grow flex-col w-full h-full"
            ref={flowParent}
          >
            <ReactFlow
              nodes={nodes}
              onNodesChange={onNodesChange}
              edges={edges}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onConnect={onConnect}
              connectionLineType={ConnectionLineType.Bezier}
              connectionLineStyle={{ strokeWidth: 2, stroke: 'darkgreen' }}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              panOnScroll
              selectionOnDrag
              selectionMode={SelectionMode.Partial}
              fitView
              fitViewOptions={{ maxZoom: 1 }}
              attributionPosition="bottom-right"
            >
              <Background variant={BackgroundVariant.Lines} gap={24} size={2} color='#400f0f0f' />
              <Controls
                fitViewOptions={{ maxZoom: 1 }}
                showInteractive={false}
                position="bottom-left"
                className="flex"
              />
              <Panel position="top-right" className="flex items-center p-1 gap-2">
                <ViewToggle mode={'python'} setMode={setMode} />
              </Panel>
            </ReactFlow>
          </div>
          {!nodePanePinned && (
            <NodeButton onAddNode={onAddNode} className="absolute top-2 left-2" />
          )}
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
            <TabsContent value="config" className="flex-1 overflow-auto">
              <div>Hello</div>
            </TabsContent>
            <TabsContent value="chat" className="flex-1 overflow-auto">
              {activeChatId && <ChatPane chat={activeChatId} />}
            </TabsContent>
            <TabsContent value="nodes" className="flex-1 overflow-auto">
              <JsonViewer data={project} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
