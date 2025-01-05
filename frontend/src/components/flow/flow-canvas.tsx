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
import { NodeButton } from './node-button';
import { PythonViewer } from './python';
import { genId } from '@/lib/id';
import { useChats, useProject } from '@/hooks';
import { debounce } from 'lodash-es';
import { Chat as ChatType } from '@/store/chats';
import { nanoid } from 'nanoid';
import { Button } from '../ui/button';

interface DebugRect {
  x: number;
  y: number;
  width: number;
  height: number;
  id?: string;
  measured?: any;
  style?: any;
}

interface MousePositionState {
  flow: XYPosition;
  debug?: {
    zoom: number;
    draggedNode: DebugRect;
    potentialGroups: DebugRect[];
    dimensions?: {
      nodeId: string;
      measured: any;
      style: any;
    }[];
    intersectionTest?: {
      nodeId: string;
      xTest: string;
      yTest: string;
      xResult: boolean;
      yResult: boolean;
    }[];
  };
}

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

export const FlowCanvas = ({ projectId }: { projectId: number }) => {
  const { project, isLoading, isError } = useProject(projectId);
  const { screenToFlowPosition } = useReactFlow();
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges] = useEdgesState<Edge>([]);
  const { setIsDirty } = useDebouncedUpdate(projectId);
  const { chats, createChat } = useChats();
  const [mode, setMode] = useState<'main' | 'flow' | 'json' | 'python'>('flow');
  const flowParent = useRef<HTMLDivElement>(null);
  const [activeChatId, setActiveChatId] = useState<ChatType | undefined>();
  const [mousePosition, setMousePosition] = useState<MousePositionState | null>(
    null
  );

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
        let nextNodes = applyNodeChanges(changes, nds);

        // Handle node dragging for grouping/ungrouping
        changes.forEach((change) => {
          if (change.type === 'position') {
            const draggedNode = nextNodes.find((n) => n.id === change.id);
            if (
              !draggedNode ||
              (draggedNode.type && isGroupType(draggedNode.type))
            ) {
              return;
            }

            // Calculate absolute position for the node
            const absolutePosition = { ...draggedNode.position };
            const oldParent = draggedNode.parentId
              ? nextNodes.find((n) => n.id === draggedNode.parentId)
              : null;
            if (oldParent) {
              absolutePosition.x += oldParent.position.x;
              absolutePosition.y += oldParent.position.y;
            }

            // During dragging, update the node's position to be absolute
            if ('dragging' in change && change.dragging) {
              draggedNode.position = absolutePosition;
              draggedNode.parentId = undefined;
              draggedNode.extent = undefined;

              const groupNode = nextNodes.find(
                (n) =>
                  n.type === 'groupchat' &&
                  n.id !== draggedNode.id &&
                  !n.parentId && // Prevent nested groups
                  // Check if the node position is within the group's bounds
                  absolutePosition.x >= n.position.x &&
                  absolutePosition.x <= n.position.x + (n.width ?? 0) &&
                  absolutePosition.y >= n.position.y &&
                  absolutePosition.y <= n.position.y + (n.height ?? 0)
              );

              // Update all group nodes' data with current hover state
              nextNodes = nextNodes.map((node) => {
                if (node.type === 'groupchat') {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      hoveredGroupId: groupNode?.id || null,
                    },
                  };
                }
                return node;
              });

              return;
            }

            // When drag ends, handle grouping/ungrouping
            if ('dragging' in change && !change.dragging) {
              // Clear hover state from all group nodes
              nextNodes = nextNodes.map((node) => {
                if (node.type === 'groupchat') {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      hoveredGroupId: null,
                    },
                  };
                }
                return node;
              });

              const groupNode = nextNodes.find(
                (n) =>
                  n.type === 'groupchat' &&
                  n.id !== draggedNode.id &&
                  !n.parentId && // Prevent nested groups
                  // Check if the node position is within the group's bounds
                  absolutePosition.x >= n.position.x &&
                  absolutePosition.x <= n.position.x + (n.width ?? 0) &&
                  absolutePosition.y >= n.position.y &&
                  absolutePosition.y <= n.position.y + (n.height ?? 0)
              );

              // Handle grouping - if inside a group
              if (groupNode) {
                // Node is entering a group
                draggedNode.parentId = groupNode.id;
                draggedNode.position = {
                  x: absolutePosition.x - groupNode.position.x,
                  y: absolutePosition.y - groupNode.position.y,
                };
                draggedNode.extent = 'parent';

                // Ensure group node is before its children
                nextNodes = nextNodes.filter((n) => n.id !== draggedNode.id);
                const groupIndex = nextNodes.findIndex(
                  (n) => n.id === groupNode.id
                );
                nextNodes.splice(groupIndex + 1, 0, draggedNode);
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
      console.log('edge changes', changes);
      if (changes.some((change) => change.type !== 'select')) {
        setIsDirty(true);
      }
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setIsDirty]
  );

  const onDragOver = useCallback(
    (event: React.DragEvent) => {
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
          position.x < n.position.x + (n.width ?? 0) &&
          position.y > n.position.y &&
          position.y < n.position.y + (n.height ?? 0)
      );

      // Update all group nodes' data with current hover state
      setNodes(
        nodes.map((node) => {
          if (node.type === 'groupchat') {
            return {
              ...node,
              data: {
                ...node.data,
                hoveredGroupId: groupNode?.id || null,
              },
            };
          }
          return node;
        })
      );
    },
    [nodes, screenToFlowPosition, flowParent]
  );

  const onDragLeave = useCallback(() => {
    // Clear hover state from all group nodes
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.type === 'groupchat') {
          return {
            ...node,
            data: {
              ...node.data,
              hoveredGroupId: null,
            },
          };
        }
        return node;
      })
    );
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const data = JSON.parse(event.dataTransfer.getData('application/json'));
      if (!data || !flowParent.current) return;

      const flowBounds = flowParent.current.getBoundingClientRect();
      const position = screenToFlowPosition({
        x: event.clientX - flowBounds.left,
        y: event.clientY - flowBounds.top,
      });

      const { offsetX, offsetY, ...cleanedData } = data;
      const newId = nanoid();
      const newNode = {
        id: `node-${data.id}-${newId}`,
        type: data.id,
        position,
        data: cleanedData,
        selected: false,
        draggable: true,
        selectable: true,
        focusable: true,
        parentId: undefined,
        style: undefined,
      } satisfies Node;

      // Find if we're dropping into a group node
      const groupNode = nodes.find(
        (n) =>
          n.type === 'groupchat' &&
          position.x > n.position.x &&
          position.x < n.position.x + (n.width ?? 0) &&
          position.y > n.position.y &&
          position.y < n.position.y + (n.height ?? 0)
      );

      setNodes((nds) => {
        // Clear hover state from all nodes first
        const updatedNodes = nds.map((n) => ({
          ...n,
          selected: false,
          data:
            n.type === 'groupchat'
              ? { ...n.data, hoveredGroupId: null }
              : n.data,
        }));

        if (groupNode) {
          // Adjust position to be relative to the group node
          const updatedNode = {
            ...newNode,
            position: {
              x: position.x - groupNode.position.x,
              y: position.y - groupNode.position.y,
            },
            parentId: groupNode.id,
            // If the node being dropped is also a group, adjust its size
            ...(data.id === 'groupchat'
              ? {
                  style: {
                    width: Math.min(300, groupNode.width! - 50),
                    height: Math.min(200, groupNode.height! - 50),
                  },
                }
              : {}),
          };

          // Insert new node right after its parent group
          const groupIndex = updatedNodes.findIndex(
            (n) => n.id === groupNode.id
          );
          if (groupIndex !== -1) {
            updatedNodes.splice(groupIndex + 1, 0, updatedNode);
            return updatedNodes;
          }
        }

        // If not in a group or group not found, just append to the end
        return [...updatedNodes, newNode];
      });
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

  if (isLoading) {
    return (
      <div className="relative flex w-full h-full items-center justify-center">
        <Icons.logoSimple className="w-12 h-12 text-muted-foreground/50 animate-pulse" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative flex w-full h-full items-center justify-center">
        <p className="text-red-500">Project load failed {projectId}</p>
      </div>
    );
  }

  return (
    <>
      {mode === 'python' ? (
        <PythonViewer data={project} setMode={setMode} />
      ) : (
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
            onMouseMove={(event) => {
              if (!flowParent.current) return;
              const flowBounds = flowParent.current.getBoundingClientRect();
              const flowPosition = screenToFlowPosition({
                x: event.clientX - flowBounds.left,
                y: event.clientY - flowBounds.top,
              });
              setMousePosition({ flow: flowPosition } as MousePositionState);
            }}
          >
            <Background
              variant={BackgroundVariant.Lines}
              gap={50}
              size={4}
              color="rgba(128,128,128,0.1)"
            />
            <Controls
              fitViewOptions={{ maxZoom: 1 }}
              showInteractive={false}
              position="bottom-left"
              className="flex"
            />
            <Panel position="top-right" className="flex items-center p-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMode('python')}
              >
                <Icons.python className="w-4 h-4" />
                <span className="text-xs">Generate Python</span>
              </Button>
            </Panel>
            <Panel
              position="bottom-right"
              className="flex flex-col items-end p-1 gap-1 text-xs font-mono"
            >
              <div>{JSON.stringify(mousePosition?.flow)}</div>
              {mousePosition?.debug && (
                <>
                  <div className="text-red-500">
                    Dragged: {JSON.stringify(mousePosition.debug.draggedNode)}
                    Groups:{' '}
                    {JSON.stringify(mousePosition.debug.potentialGroups)}
                  </div>
                  <div className="text-yellow-500">
                    Intersection Tests:{' '}
                    {JSON.stringify(
                      mousePosition.debug.intersectionTest,
                      null,
                      2
                    )}
                  </div>
                </>
              )}
            </Panel>
          </ReactFlow>
          <NodeButton onAddNode={onAddNode} className="absolute top-2 left-2" />
        </div>
      )}
    </>
  );
};
