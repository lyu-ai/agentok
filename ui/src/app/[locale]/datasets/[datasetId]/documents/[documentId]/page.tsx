import { useChunks } from "@/hooks";
import { useTranslations } from "next-intl";
import ChunkCard from "./components/ChunkCard";

const Page = ({ params }: { params: { datasetId: string; documentId: string } }) => {
  const datasetId = parseInt(params.datasetId, 10);
  const documentId = parseInt(params.documentId, 10);
  const t = useTranslations('page.Documents');
  const { chunks } = useChunks(datasetId, documentId);

  return (
    <div className="flex flex-col w-full gap-4 p-2 flex-grow h-full overflow-y-auto">
      <div className="flex flex-wrap gap-4">
        {chunks.map((chunk) => (
          <ChunkCard key={chunk.id} chunk={chunk} documentId={documentId} datasetId={datasetId} />
        ))}
      </div>
    </div>
  );
}