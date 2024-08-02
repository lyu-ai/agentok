import Loading from "@/components/Loading";
import { useDatasets } from "@/hooks";
import DatasetCard from "./DatasetCard";

const DatasetList = () => {
  const { datasets, isLoading, isError } = useDatasets();
  if (isLoading) {
    return (
      <Loading />
    );
  }
  return (
    <div className="flex flex-wrap gap-4">
      {datasets.map((dataset) => (
        <DatasetCard key={dataset.id} datasetId={dataset.id} />
      ))}
    </div>
  )
};

export default DatasetList;