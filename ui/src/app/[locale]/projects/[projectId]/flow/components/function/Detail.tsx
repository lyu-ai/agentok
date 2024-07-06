import EditableText from '@/components/EditableText';
import { TbMathFunction } from 'react-icons/tb';
import { setNodeData } from '../../utils/flow';
import { useReactFlow } from 'reactflow';
import ParamList from './ParamList';
import CodeEditor from './CodeEditor';

const FunctionDetail = ({ nodeId, func, ...props }: any) => {
  const instance = useReactFlow();
  const node = instance?.getNode(nodeId);
  const setFunctionData = (key: any, value: any) => {
    setNodeData(instance, nodeId, {
      functions: node?.data?.functions?.map((f: any) => {
        if (f.id === func.id) {
          return {
            ...f,
            [key]: value,
          };
        }
        return f;
      }),
    });
  };
  return (
    <div className="relative flex flex-col w-full gap-2 p-2 h-full overflow-y-auto">
      <div className="flex items-start gap-2">
        <TbMathFunction className="w-7 h-7" />
        <div className="w-full flex flex-col gap-2 text-base">
          <div className="flex items-center w-full justify-between">
            <EditableText
              text={func?.name}
              onChange={(text: any) => {
                setFunctionData('name', text);
              }}
              showButtons
              className="text-base-content/80 !text-lg !font-bold"
            />
            <div className="flex items-center gap-2 text-sm">
              <span>Async Function</span>
              <input
                type="checkbox"
                checked={func?.async ?? false}
                onChange={e => {
                  setFunctionData('async', e.target.checked);
                }}
                className="toggle toggle-sm"
              />
            </div>
          </div>
          <EditableText
            text={func?.description}
            onChange={(text: any) => {
              setFunctionData('description', text);
            }}
            showButtons
            className="text-base-content/80 !text-base !font-normal"
          />
        </div>
      </div>
      <ParamList nodeId={nodeId} func={func} className="shrink-0" />
      <CodeEditor nodeId={nodeId} func={func} className="flex-grow" />
    </div>
  );
};

export default FunctionDetail;
