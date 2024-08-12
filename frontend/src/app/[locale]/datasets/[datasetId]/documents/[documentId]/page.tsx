'use client';
import { useChunks, useDataset, useDocument } from '@/hooks';
import ChunkCard from './components/ChunkCard';
import { Chunk } from '@/store/dataset';
import { useState } from 'react';
import { getFileIcon } from '@/utils/icon';
import ChunkConfig from './components/ChunkConfig';
import { RiDatabase2Line } from 'react-icons/ri';
import Link from 'next/link';

const Page = ({
  params,
}: {
  params: { datasetId: string; documentId: string };
}) => {
  const datasetId = parseInt(params.datasetId, 10);
  const documentId = parseInt(params.documentId, 10);
  const { chunks, updateChunk } = useChunks(datasetId, documentId);
  const { dataset } = useDataset(datasetId);
  const { document } = useDocument(datasetId, documentId);

  const [activeChunk, setActiveChunk] = useState<Chunk | null>(null);

  const handleUpdateChunk = async (chunkId: number, chunk: Partial<Chunk>) => {
    await updateChunk(chunkId, chunk);
  };

  if (!dataset || !document) return null;

  const FileIcon = getFileIcon(document.path);

  return (
    <div className="flex flex-col w-full gap-2 p-2 flex-grow h-full">
      <div className="breadcrumbs flex-shrink-0">
        <ul>
          <li>
            <Link href="/datasets">
              <RiDatabase2Line />
            </Link>
          </li>
          <li>
            <Link href={`/datasets/${dataset.id}`}>{dataset.name}</Link>
          </li>
          <li className="">
            <FileIcon />
            {document.name}
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-2">
        {chunks.map((chunk) => (
          <ChunkCard
            key={chunk.id}
            datasetId={datasetId}
            chunk={chunk}
            selected={activeChunk?.id === chunk.id}
            onSelect={setActiveChunk}
            onUpdate={handleUpdateChunk}
          />
        ))}
      </div>
      {activeChunk && (
        <ChunkConfig
          show={!!activeChunk}
          chunk={activeChunk}
          onUpdate={handleUpdateChunk}
          onClose={() => setActiveChunk(null)}
        />
      )}
    </div>
  );
};

export default Page;
