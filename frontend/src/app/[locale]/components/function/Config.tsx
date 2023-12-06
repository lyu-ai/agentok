import PopupDialog from '@/components/PopupDialog';
import clsx from 'clsx';
import { TbFunction } from 'react-icons/tb';
import { setNodeData } from '../../utils/flow';
import { useReactFlow } from 'reactflow';
import { useEffect, useState } from 'react';
import FunctionDetail from './Detail';
import FunctionBlock from './Block';
import { genId } from '@/utils/id';
import { MdOutlineAdd } from 'react-icons/md';
import { Tooltip } from 'react-tooltip';

const FunctionConfig = ({ nodeId, data, className, ...props }: any) => {
  const [selectedFunction, setSelectedFunction] = useState(-1);
  const instance = useReactFlow();
  useEffect(() => {
    if (data.functions?.length) setSelectedFunction(0);
  }, []);
  const onAdd = () => {
    setNodeData(instance, nodeId, {
      functions: [
        {
          id: 'function-' + genId(),
          name: 'hello',
          description: 'Print hello world message.',
          code: '',
          parameters: [
            {
              id: 'param-' + genId(),
              name: 'message',
              type: 'string',
              description: 'The message to be printed.',
            },
          ],
        },
        ...(data.functions || []),
      ],
    });
    setSelectedFunction(0); // select the new added function
  };
  const onDelete = (func: any) => {
    const updatedFunctions = data.functions?.filter(
      (f: any) => f.id !== func.id
    );
    setNodeData(instance, nodeId, { functions: updatedFunctions });
    if (selectedFunction > updatedFunctions.length - 1)
      setSelectedFunction(selectedFunction - 1); // either select the last one or -1
  };
  return (
    <PopupDialog
      title={
        <div className="flex items-center gap-2">
          <TbFunction className="w-7 h-7" />
          <span className="text-md font-bold">自定义函数</span>
        </div>
      }
      className={clsx(
        'flex flex-col w-full h-full bg-gray-800/80 backgrop-blur-md border border-gray-700 shadow-box-lg shadow-gray-700',
        className
      )}
      classNameTitle="border-b border-base-content/10"
      classNameBody="flex flex-grow w-full h-full"
      {...props}
    >
      <div className="flex flex-col gap-2 h-full">
        <div className="flex flex-col gap-2 h-full border-r p-2 border-base-content/10 w-64">
          <button className="btn btn-secondary" onClick={onAdd}>
            <MdOutlineAdd className="w-5 h-5" />
            <span>添加函数</span>
          </button>
          <div className="flex flex-col gap-2 h-full overflow-y-auto">
            {data.functions?.map((func: any, index: any) => (
              <FunctionBlock
                selected={selectedFunction === index}
                func={func}
                key={index}
                onDelete={() => onDelete(func)}
                onClick={() => setSelectedFunction(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-grow h-full overflow-y-auto">
        {selectedFunction === -1 ? (
          <div className="flex flex-col w-full h-full items-center justify-center flex-grow text-base-content/50">
            请选择一个函数
          </div>
        ) : (
          <FunctionDetail
            nodeId={nodeId}
            func={data.functions?.[selectedFunction]}
          />
        )}
      </div>
      <Tooltip id="func-tooltip" place="bottom" />
    </PopupDialog>
  );
};

export default FunctionConfig;
