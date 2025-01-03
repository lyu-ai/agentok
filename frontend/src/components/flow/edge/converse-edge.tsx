import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  Position,
} from '@xyflow/react';
import { Icons } from '@/components/icons';

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
          stroke: selected ? 'green' : '',
          strokeDasharray: selected ? '5 5' : '0',
          strokeWidth: selected ? 3 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <Icons.chat className="w-4 h-4" />
      </EdgeLabelRenderer>
    </>
  );
}
