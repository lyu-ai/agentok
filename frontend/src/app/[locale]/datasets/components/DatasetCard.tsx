'use client';
import { useDataset, useDocuments } from '@/hooks';
import clsx from 'clsx';
import Link from 'next/link';
import {
  RiDeleteBin4Line,
  RiDatabaseLine,
  RiSettings4Line,
  RiFile2Line,
} from 'react-icons/ri';
import DatasetConfig from './DatasetConfig';
import { useState } from 'react';

const DatasetCard = ({ dataset, ...props }: any) => {
  const { updateDataset, isUpdating, deleteDataset, isDeleting } = useDataset(
    dataset.id
  );
  const { documents } = useDocuments(dataset.id);
  const [showConfig, setShowConfig] = useState(false);
  const handleDelete = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    deleteDataset();
  };

  const handleApplyConfig = async (name: string, description: string) => {
    await updateDataset({ name, description });
  };

  if (!dataset) {
    return null;
  }

  return (
    <>
      <Link
        href={`/datasets/${dataset.id}`}
        className={clsx(
          'relative group w-full flex flex-col gap-2 p-3 max-w-sm min-h-48 rounded-md bg-base-content/10 border-base-content/20 hover:bg-base-content/20 border cursor-pointer hover:shadow-box hover:shadow-gray-700'
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <RiDatabaseLine className="w-9 h-9 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <div className="text-lg font-bold">{dataset.name}</div>
            <div className="text-xs text-base-content/50">
              {new Date(dataset.created_at).toLocaleString()}
            </div>
          </div>
        </div>
        <div className="text-sm text-base-content/50 w-full line-clamp-4 h-20">
          {dataset.description}
        </div>
        <div className="flex items-center w-full justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setShowConfig(true);
              }}
              className="btn btn-xs btn-square btn-ghost hover:text-primary"
            >
              {isUpdating ? (
                <div className="loading loading-xs" />
              ) : (
                <RiSettings4Line className="w-4 h-4" />
              )}
            </button>
            <div className="flex items-center gap-1 border border-base-content/20 rounded-full px-2 py-0.5 text-base-content/50 text-xs">
              {documents.length} documents
            </div>
          </div>
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
      </Link>
      <DatasetConfig
        show={showConfig}
        dataset={dataset}
        onApply={handleApplyConfig}
        onClose={() => setShowConfig(false)}
      />
    </>
  );
};

export default DatasetCard;
