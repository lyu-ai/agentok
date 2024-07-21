import { useChunk } from "@/hooks";

const ChunkCard = ({ chunkId, documentId, datasetId }: any) => {
  const { chunk, isError, isLoading } = useChunk(datasetId, documentId, chunkId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading chunk</div>;
  }

  if (!chunk) {
    return <div>Chunk not found</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2">
          <div className="text-lg font-bold">{chunk.id}</div>
          <div className="text-sm">{chunk.content}</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm">{chunk.created_at}</div>
        </div>
      </div>
    </div>
  );
}

export default ChunkCard;