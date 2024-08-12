'use client';

import { useDataset, useDocuments } from '@/hooks';
import DocumentCard from './components/DocumentCard';
import { RiDatabase2Line, RiSettings4Line } from 'react-icons/ri';
import UploadDocumentCard from './components/UploadDocumentCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';
import DatasetConfig from '../components/DatasetConfig';
import RetrieveTestPane from './components/RetrieveTestPane';

const Page = ({ params }: { params: { datasetId: string } }) => {
  const datasetId = parseInt(params.datasetId, 10);
  const { documents } = useDocuments(datasetId);
  const { dataset, updateDataset, isUpdating } = useDataset(datasetId);
  const [showConfig, setShowConfig] = useState(false);

  const handleApplyConfig = async (name: string, description: string) => {
    await updateDataset({ name, description });
  };

  if (!dataset) return null;
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-full w-full p-2">
        <div className="breadcrumbs flex-shrink-0">
          <ul>
            <li>
              <a href="/datasets">
                <RiDatabase2Line />
              </a>
            </li>
            <li className="">
              {dataset.name}
              <button
                className="ml-1 btn btn-xs btn-square btn-ghost"
                onClick={() => setShowConfig(true)}
              >
                {isUpdating ? (
                  <div className="loading loading-xs" />
                ) : (
                  <RiSettings4Line className="w-4 h-4" />
                )}
              </button>
            </li>
          </ul>
        </div>

        <div className="flex flex-1 w-full h-full gap-2 overflow-y-hidden">
          <div className="flex flex-col flex-1 gap-2 w-full h-full overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-2">
              <UploadDocumentCard datasetId={datasetId} />
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  className="bg-base-content/10 p-2 rounded-md"
                />
              ))}
            </div>
          </div>
          {documents.length > 0 && <RetrieveTestPane dataset={dataset} />}
        </div>
      </div>
      <DatasetConfig
        dataset={dataset}
        show={showConfig}
        onClose={() => setShowConfig(false)}
        onApply={handleApplyConfig}
      />
    </DndProvider>
  );
};

export default Page;
