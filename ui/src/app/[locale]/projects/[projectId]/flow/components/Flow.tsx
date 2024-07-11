import ReactFlow, {
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
  ControlButton,
  XYPosition,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  nodeTypes,
  edgeTypes,
  initialEdges,
  initialNodes,
  isConversable,
} from '../utils/flow';
import { useState, useCallback, useRef, useEffect } from 'react';
import ViewToggle from './ViewToggle';
import NodeButton from './NodeButton';
import Python from './Python';
import Json from './Json';
import { genId } from '@/utils/id';
import ChatButton from '../../../../components/chat/ChatButton';
import { useTranslations } from 'next-intl';
import { useChats, useProject } from '@/hooks';
import { debounce } from 'lodash-es';
import ChatPane from '../../../../components/chat/ChatPane';
import useProjectStore from '@/store/projects';
import NodePane from './NodePane';
import { Chat as ChatType } from '@/store/chats';

const Agentflow = ({ projectId }: any) => {
  const { project, updateProject, isUpdating, isLoading, isError } = useProject(
    projectId
  );

  const [mode, setMode] = useState<'main' | 'flow' | 'json' | 'python'>('flow');
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const flowParent = useRef<HTMLDivElement>(null);
  const { fitView, screenToFlowPosition, toObject } = useReactFlow();
  const t = useTranslations('component.Flow');
  const chatPanePinned = useProjectStore(state => state.chatPanePinned);
  const nodePanePinned = useProjectStore(state => state.nodePanePinned);
  const { chats, createChat, isCreating } = useChats();
  const [chat, setChat] = useState<ChatType | undefined>();

  // Suppress error code 002
  // https://github.com/xyflow/xyflow/issues/3243
  const store = useStoreApi();
  if (process.env.NODE_ENV === 'development') {
    store.getState().onError = (code, message) => {
      if (code === '002') {
        return;
      }
      console.warn('Workflow warning:', code, message);
    };
  }

  useEffect(() => {
    if (project?.flow) {
      setNodes(project.flow.nodes);
      setEdges(project.flow.edges);
    }
    setIsDirty(false);
    // fitView({ padding: 0.2, maxZoom: 1 });
    const existingChat = chats.findLast(chat => chat.sourceId === project?.id);
    if (existingChat) {
      setChat(existingChat);
    }
  }, [project]);

  const initialLoad = useRef(true);

  const debouncedUpdateFlow = debounce((currentFlow: any) => {
    updateProject({
      id: projectId,
      flow: currentFlow,
    });
    setIsDirty(false);
  }, 1000);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    if (isDirty) {
      debouncedUpdateFlow(toObject());
    }

    return () => {
      debouncedUpdateFlow.cancel();
    };
  }, [
    project,
    nodes,
    edges,
    isDirty,
    projectId,
    toObject,
    debouncedUpdateFlow,
  ]);
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      if (
        !initialLoad.current &&
        changes.some(change => change.type !== 'select')
      ) {
        setIsDirty(true); // Ignore the dragging and selection events
      }

      setNodes(nds => {
        let newNodes = applyNodeChanges(changes, nds);

        // Handle parent-child relationships for group nodes
        changes.forEach(change => {
          if (change.type === 'position' && !change.dragging) {
            const draggedNode = newNodes.find(n => n.id === change.id);
            if (draggedNode) {
              const nodePosition = draggedNode.position;

              // Find the last group node containing the dragged node
              const groupNode = newNodes.reduce(
                (foundGroup: Node | null, currentNode: Node) => {
                  if (
                    currentNode.type === 'groupchat' &&
                    currentNode.id !== draggedNode.id &&
                    isPositionInsideNode(nodePosition, currentNode)
                  ) {
                    return currentNode;
                  }
                  return foundGroup;
                },
                null
              );

              if (groupNode) {
                if (draggedNode.parentId !== groupNode.id) {
                  // Node is entering a new group
                  const newRelativePosition = {
                    x: nodePosition.x - groupNode.position.x,
                    y: nodePosition.y - groupNode.position.y,
                  };
                  draggedNode.parentId = groupNode.id;
                  draggedNode.position = newRelativePosition;
                }
                // If it's already a child, position is handled by React Flow
              } else if (draggedNode.parentId) {
                // Node is not over any group
                const parentNode = newNodes.find(
                  n => n.id === draggedNode.parentId
                );
                if (parentNode) {
                  // Convert to absolute position before detaching from the group
                  const newAbsolutePosition = {
                    x: nodePosition.x + parentNode.position.x,
                    y: nodePosition.y + parentNode.position.y,
                  };
                  draggedNode.position = newAbsolutePosition;
                }
                delete draggedNode.parentId;
              }
            }
          }
        });

        // Ensure group nodes are ahead of their child nodes in the array
        newNodes = newNodes.sort((a, b) => {
          if (a.type === 'groupchat' && b.parentId === a.id) {
            return -1; // a is the group, b is the child
          } else if (b.type === 'groupchat' && a.parentId === b.id) {
            return 1; // b is the group, a is the child
          } else {
            return 0;
          }
        });

        return newNodes;
      });
    },
    [setNodes]
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
      if (
        !initialLoad.current &&
        changes.some(change => change.type !== 'select')
      ) {
        setIsDirty(true);
      }
      setEdges(eds => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!event.dataTransfer.getData('json')) {
        // To filter out unexpected drop operation
        return;
      }

      if (!flowParent.current) {
        console.warn(
          'Unexpected null value of flowParent, drag & drop failed.'
        );
        return;
      }

      // Get the current bounds of the ReactFlow wrapper element
      const flowBounds = flowParent.current.getBoundingClientRect();

      // Extract the data from the drag event and parse it as a JSON object
      const data = JSON.parse(event.dataTransfer.getData('json'));

      // Calculate the position where the node should be created
      const position = screenToFlowPosition({
        x: event.clientX - flowBounds.left - data.offsetX,
        y: event.clientY - flowBounds.top - data.offsetY,
      }) ?? { x: 0, y: 0 };

      if (position.x === 0 && position.y === 0) {
        console.warn(
          'Failed calculating target position, need to check the problem. context:',
          position,
          data
        );
      }

      // It's not necessary to keep the offsetX/Y as they are only for drap/drop
      const { offsetX, offsetY, ...cleanedData } = data;

      // Generate a unique node ID
      const newId = genId();

      const newNode: Node = {
        id: newId,
        type: data.type,
        position,
        selected: true,
        data: cleanedData,
      };

      // Add the new node to the list of nodes in state
      // And clean the previous selections
      setNodes(nds =>
        nds.map(nd => ({ ...nd, selected: false } as Node)).concat(newNode)
      );
    },
    // Specify dependencies for useCallback
    [screenToFlowPosition, setNodes, flowParent]
  );

  const onConnect = (params: any) => {
    const sourceNode = nodes.find(nd => nd.id === params.source);
    const targetNode = nodes.find(nd => nd.id === params.target);
    const isRelation = isConversable(sourceNode) && isConversable(targetNode);
    setEdges((eds: any) => {
      let newEdges = {
        ...params,
        strokeWidth: 2,
      };
      if (isRelation) {
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

    const newNode: Node = {
      id: newId,
      type,
      position: { x: 150 + randInt(100), y: 50 + randInt(50) },
      data,
    };
    setNodes(nds => nds.concat(newNode));
  };

  const onClickChat = async () => {
    if (!project) return;
    const existingChat = chats.findLast(chat => chat.sourceId === project.id);
    if (existingChat) {
      setChat(existingChat);
      return;
    }
    await createChat(project.id, 'project').then(chat => setChat(chat));
  };

  if (mode === 'python') {
    return (
      <div className="relative flex w-full h-full">
        <Python data={project} setMode={setMode} />
      </div>
    );
  } else if (mode === 'json') {
    return (
      <div className="relative flex w-full h-full">
        <Json data={project} setMode={setMode} />
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
          {t('project-load-failed')} {projectId}
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex w-full h-full overflow-hidden">
      {nodePanePinned && (
        <div className="flex w-80 h-full pl-1 pb-1">
          <NodePane onAddNode={onAddNode} />
        </div>
      )}
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
          onDrop={onDrop}
          panOnScroll
          selectionOnDrag
          selectionMode={SelectionMode.Partial}
          fitView
          fitViewOptions={{ maxZoom: 1 }}
          attributionPosition="bottom-right"
        >
          <Background
            id="logo"
            gap={32}
            color="hsl(var(--sc))"
            className="engraved-bg bg-no-repeat bg-center bg-[url('/logo-bg.svg')]"
            style={{ backgroundSize: '160px' }}
          />
          <Controls
            fitViewOptions={{ maxZoom: 1 }}
            showInteractive={false}
            position="bottom-left"
            className="flex"
          />
          <Panel position="top-right" className="flex p-1 gap-2">
            <ViewToggle mode={'json'} setMode={setMode} />
            <ViewToggle mode={'python'} setMode={setMode} />
          </Panel>
        </ReactFlow>
        <div className="absolute bottom-0 left-12 flex w-full items-center px-2">
          <div className="flex flex-shrink-0 items-center gap-2"></div>
        </div>
      </div>
      {!nodePanePinned && (
        <NodeButton onAddNode={onAddNode} className="absolute top-2 left-2" />
      )}
      {chatPanePinned ? (
        <div className="text-sm w-96 lg:w-[480px] h-full shrink-0">
          <ChatPane onStartChat={onClickChat} chatId={chat?.id ?? ''} />
        </div>
      ) : (
        <ChatButton
          project={project}
          onStartChat={onClickChat}
          chatId={chat?.id}
          className="absolute bottom-6 right-2"
        />
      )}
    </div>
  );
};

export default Agentflow;
