import Loading from "@/components/Loading";
import { useDatasets } from "@/hooks";
import DatasetCard from "./DatasetCard";

const DatasetList = ({ projectId }: { projectId: number }) => {
  const { datasets, isLoading, isError } = useDatasets(projectId);
  if (isLoading) {
    return (
      <Loading />
    );
  }
  return (
    <div className="flex flex-wrap gap-4">
      {datasets.map((dataset) => (
        <DatasetCard key={dataset.id} datasetId={dataset.id} projectId={projectId} />
      ))}
    </div>
  )
};

export default DatasetList;