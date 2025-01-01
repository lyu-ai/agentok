import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
} from 'reactflow';
import { ConverseConfig } from './converse-config';

export function ConverseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  data,
  style,
}: any) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: selected ? 'greenyellow' : '',
          strokeDasharray: selected ? '5 5' : '0',
          strokeWidth: selected ? 3 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <ConverseConfig
          edgeId={id}
          data={data}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        />
      </EdgeLabelRenderer>
    </>
  );
}
