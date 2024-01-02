import ReactFlow, {
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  useStoreApi,
  useReactFlow,
  addEdge,
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
import { useFlow } from '@/hooks';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash-es';

const Autoflow = ({ flowId }: any) => {
  const { flow, updateFlow, isUpdating, isLoading, isError } = useFlow(flowId);

  const [mode, setMode] = useState<'main' | 'flow' | 'json' | 'python'>('flow');
  const [nodes, setNodes] = useState<any[]>(initialNodes);
  const [edges, setEdges] = useState<any[]>(initialEdges);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const flowParent = useRef<HTMLDivElement>(null);
  const { fitView, screenToFlowPosition, toObject } = useReactFlow();
  const t = useTranslations('component.Autoflow');
  const router = useRouter();

  // Suppress error code 002
  // https://github.com/xyflow/xyflow/issues/3243
  const store = useStoreApi();
  if (process.env.NODE_ENV === 'development') {
    store.getState().onError = (code: any, message: any) => {
      if (code === '002') {
        return;
      }
      console.warn('Autoflow warning:', code, message);
    };
  }

  useEffect(() => {
    if (!flow?.flow) return;
    setNodes(flow?.flow?.nodes ?? []);
    setEdges(flow?.flow?.edges ?? []);
    setIsDirty(false);
    // fitView({ padding: 0.2, maxZoom: 1 });
  }, [flow]);

  const initialLoad = useRef(true);

  const debouncedUpdateFlow = debounce((flowId: string, currentFlow: any) => {
    updateFlow({
      id: flowId,
      flow: currentFlow,
    });
    setIsDirty(false);
  }, 1000);

  useEffect(() => {
    if (!flow?.flow || initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    if (isDirty) {
      debouncedUpdateFlow(flowId, toObject());
    }

    return () => {
      debouncedUpdateFlow.cancel();
    };
  }, [flow, nodes, edges, isDirty, flowId, toObject, debouncedUpdateFlow]);

  const onNodesChange = useCallback(
    (changes: any[]) => {
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
    (changes: any[]) => {
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

      const newNode = {
        id: newId,
        type: data.type,
        position,
        selected: true,
        data: cleanedData,
      };

      // Add the new node to the list of nodes in state
      // And clean the previous selections
      setNodes(nds =>
        nds.map(nd => ({ ...nd, selected: false })).concat(newNode)
      );
    },
    // Specify dependencies for useCallback
    [screenToFlowPosition, setNodes, flowParent]
  );

  const onConnect = (params: any) => {
    setEdges((eds: any) => {
      const newEdges = {
        ...params,
        type: 'smoothstep',
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

    const newNode = {
      id: newId,
      type,
      position: { x: 150 + randInt(100), y: 50 + randInt(50) },
      data,
    };
    setNodes(nds => nds.concat(newNode));
  };

  if (mode === 'python') {
    return (
      <div className="relative flex w-full h-full">
        <Python data={flow} setMode={setMode} />
      </div>
    );
  } else if (mode === 'json') {
    return (
      <div className="relative flex w-full h-full">
        <Json data={flow} setMode={setMode} />
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
          {t('flow-load-failed')} {flowId}
        </p>
      </div>
    );
  }

  if (!flow?.flow) return null;

  return (
    <div className="relative w-full h-full overflow-hidden" ref={flowParent}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        connectionLineType={'smoothstep'}
        connectionLineStyle={{ strokeWidth: 2, stroke: 'lightgreen' }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        panOnScroll
        selectionOnDrag
        selectionMode={'partial'}
        fitView
        fitViewOptions={{ maxZoom: 1 }}
        proOptions={{ hideAttribution: true }}
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
          position="bottom-right"
        />
      </ReactFlow>
      <div className="absolute flex items-center gap-2 right-2 top-2">
        <ViewToggle mode={'main'} setMode={() => router.push('/flow')} />
        <ViewToggle mode={'python'} setMode={setMode} />
        <ViewToggle mode={'json'} setMode={setMode} />
        <ChatButton flow={flow} />
      </div>
      <NodeButton onAddNode={onAddNode} className="absolute left-2 top-2" />
    </div>
  );
};

export default Autoflow;
