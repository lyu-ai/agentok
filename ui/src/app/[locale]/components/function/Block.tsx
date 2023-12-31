import clsx from 'clsx';
import { GoTrash } from 'react-icons/go';
import { TbMathFunction } from 'react-icons/tb';

const FunctionBlock = ({
  nodeId,
  func,
  onDelete: _onDelete,
  selected,
  ...props
}: any) => {
  const onDeleteFunc = (e: any) => {
    e.stopPropagation();
    _onDelete && _onDelete(func);
  };

  return (
    <div
      className={clsx(
        'relative group w-full flex flex-col gap-2 p-3 rounded-md border cursor-pointer hover:bg-base-content/10 hover:shadow-box hover:shadow-gray-700',
        selected
          ? 'shadow-box shadow-gray-600 bg-gray-700/90 border-gray-600'
          : 'border-base-content/10 '
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <TbMathFunction className="w-5 h-5 flex-shrink-0" />
        <div className="text-base font-bold">{func.name}</div>
      </div>
      <div className="text-sm text-base-content/50 w-full line-clamp-2">
        {func.description}
      </div>
      <div className="absolute bottom-1 right-1 hidden group-hover:block">
        <button
          className="btn btn-xs btn-square btn-ghost hover:text-red-600"
          onClick={onDeleteFunc}
        >
          <GoTrash className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FunctionBlock;
