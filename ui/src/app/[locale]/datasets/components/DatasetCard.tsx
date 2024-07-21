'use client';
import { useDataset } from '@/hooks';
import clsx from 'clsx';
import { useState } from 'react';
import { RiFormula, RiDeleteBin4Line } from 'react-icons/ri';

const DatasetCard = ({ projectId, datasetId, onDelete, selected, ...props }: any) => {
  const { dataset, isError, isLoading } = useDataset(projectId, datasetId);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async (e: any) => {
    e.stopPropagation();
    setIsDeleting(true);
    onDelete && (await onDelete(dataset).finally(() => setIsDeleting(false)));
  };

  if (!dataset || isError || isLoading) {
    return null;
  }

  return (
    <div
      className={clsx(
        'relative group w-full flex flex-col gap-2 p-3 max-w-md min-h-32 rounded-md border cursor-pointer hover:bg-base-content/10 hover:shadow-box hover:shadow-gray-700',
        selected
          ? 'shadow-box shadow-gray-600 bg-gray-700/90 border-gray-600'
          : 'border-base-content/10 '
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <RiFormula className="w-5 h-5 flex-shrink-0" />
        <div className="text-base font-bold">{dataset.name}</div>
      </div>
      <div className="text-sm text-base-content/50 w-full line-clamp-2">
        {dataset.description}
      </div>
      <div className="absolute bottom-1 right-1 hidden group-hover:block">
        <button
          className="btn btn-xs btn-square btn-ghost hover:text-red-600"
          onClick={handleDelete}
        >
          {isDeleting ? (
            <div className="loading loading-xs" />
          ) : (
            <RiDeleteBin4Line className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DatasetCard;
