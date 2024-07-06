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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nodeTypes, initialEdges, initialNodes } from '../utils/flow';
import { useState, useCallback, useRef, useEffect } from 'react';
import ViewToggle from './ViewToggle';
import NodeButton from './NodeButton';
import Python from './Python';
import Json from './Json';
import { genId } from '@/utils/id';
import ChatButton from './ChatButton';
import { useTranslations } from 'next-intl';
import { useChats, useProject } from '@/hooks';
import { debounce } from 'lodash-es';
import ChatPane from './ChatPane';
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
  const t = useTranslations('component.Workflow');
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
    setNodes(project?.flow?.nodes ?? []);
    setEdges(project?.flow?.edges ?? []);
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
      setNodes(nds => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );
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
    setEdges((eds: any) => {
      const newEdges = {
        ...params,
        animated: true,
        style: {
          strokeWidth: 2,
        },
      };
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
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineStyle={{ strokeWidth: 2, stroke: 'lightgreen' }}
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
          >
            <ControlButton>
              <ViewToggle flat mode={'python'} setMode={setMode} />
            </ControlButton>
            <ControlButton>
              <ViewToggle flat mode={'json'} setMode={setMode} />
            </ControlButton>
          </Controls>
        </ReactFlow>
        <div className="absolute bottom-0 left-12 flex w-full items-center px-2">
          <div className="flex flex-shrink-0 items-center gap-2"></div>
        </div>
      </div>
      {!nodePanePinned && (
        <NodeButton onAddNode={onAddNode} className="absolute top-2 left-2" />
      )}
      {chatPanePinned ? (
        <div className="text-sm w-96 lg:w-[480px] h-full pr-1 pb-1 shrink-0">
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
