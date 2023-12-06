import ReactFlow, {
  Node,
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  nodeTypes,
  initialEdges,
  initialNodes,
  getFlowName,
} from '../utils/flow';
import { useState, useCallback, useRef, useEffect } from 'react';
import ViewToggle from './ViewToggle';
import NodeButton from './NodeButton';
import Python from './Python';
import Json from './Json';
import { genId } from '@/utils/id';
import { IoSkullOutline } from 'react-icons/io5';
import ChatButton from './ChatButton';
import { toast } from 'react-toastify';
import { GoUpload } from 'react-icons/go';
import clsx from 'clsx';

const Flow = ({ flowId }: any) => {
  const [mode, setMode] = useState<'flow' | 'json' | 'python'>('flow');
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const flowParent = useRef<HTMLDivElement>(null);
  const { fitView, screenToFlowPosition } = useReactFlow();

  // Suppress error code 002
  // https://github.com/xyflow/xyflow/issues/3243
  const store = useStoreApi();
  if (process.env.NODE_ENV === 'development') {
    store.getState().onError = (code, message) => {
      if (code === '002') {
        return;
      }
      console.warn('Flow warning:', code, message);
    };
  }

  useEffect(() => {
    setLoading(true);
    fetch(flowId ? `/api/flows/${flowId}` : `/api/flows`)
      .then(data => data.json())
      .then(json => {
        if (Array.isArray(json)) {
          json = json[0]; // only need the first element
        }
        console.log('Loading flow:', json);
        setNodes(json?.flow?.nodes ?? []);
        setEdges(json?.flow?.edges ?? []);
        fitView({ maxZoom: 1 });
      })
      .catch(e => {
        console.warn('Failed loading flow:', e.statusText);
      })
      .finally(() => setLoading(false));
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes(nds => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges(eds => applyEdgeChanges(changes, eds)),
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
      setNodes(nds => nds.concat(newNode));
    },
    // Specify dependencies for useCallback
    [screenToFlowPosition, nodes, setNodes, flowParent]
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

    const newNode: Node = {
      id: newId,
      type,
      position: { x: 150 + randInt(100), y: 50 + randInt(50) },
      data,
    };
    setNodes(nds => nds.concat(newNode));
  };

  const onReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    fitView({ maxZoom: 1 });
  };

  const onLoad = (data: any) => {
    setNodes(data.flow?.nodes ?? []);
    setEdges(data.flow?.edges ?? []);
    fitView({ maxZoom: 1 });
  };

  const onSave = () => {
    setUploading(true);
    fetch('/api/flows', {
      method: 'POST',
      body: JSON.stringify({
        id: getFlowName(nodes),
        flow: { nodes, edges },
      }),
    })
      .then(resp => resp.json())
      .then(json => {
        console.log('Flow saved:', json);
        toast.success('保存成功: ' + getFlowName(nodes), {
          position: 'bottom-right',
        });
      })
      .catch(e => {
        console.warn('Failed saving flow:', e.statusText);
      })
      .finally(() => setUploading(false));
  };

  if (mode === 'python') {
    return (
      <div className="relative flex w-full h-full">
        <Python data={{ nodes, edges }} setMode={setMode} />
      </div>
    );
  } else if (mode === 'json') {
    return (
      <div className="relative flex w-full h-full">
        <Json data={{ nodes, edges }} setMode={setMode} />
      </div>
    );
  } else if (loading) {
    return (
      <div className="relative flex w-full h-full items-center justify-center">
        <div className="loading loading-bars loading-secondary"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden" ref={flowParent}>
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
        proOptions={{ hideAttribution: true }}
        fitView
        fitViewOptions={{
          maxZoom: 1,
        }}
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
        <button
          className="btn btn-sm btn-square btn-ghost hover:text-secondary"
          onClick={onSave}
          data-tooltip-id="default-tooltip"
          data-tooltip-content="保存至云端"
        >
          <GoUpload
            className={clsx('w-4 h-4', { 'animate-spin': uploading })}
          />
        </button>
        <ViewToggle mode={'python'} setMode={setMode} />
        <ViewToggle mode={'json'} setMode={setMode} />
        <button
          className="hover:text-orange-500 btn btn-sm btn-square btn-ghost"
          onClick={onReset}
          data-tooltip-id="default-tooltip"
          data-tooltip-content="恢复缺省节点"
        >
          <IoSkullOutline className="w-4 h-4" />
        </button>
        <ChatButton
          data={{ id: getFlowName(nodes), flow: { nodes, edges } }}
          onLoad={onLoad}
          onReset={onReset}
        />
      </div>
      <NodeButton onAddNode={onAddNode} className="absolute left-2 top-2" />
    </div>
  );
};

export default Flow;
