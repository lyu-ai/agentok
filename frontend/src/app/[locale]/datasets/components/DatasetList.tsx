import { useDatasets } from '@/hooks';
import DatasetCard from './DatasetCard';
import { useRouter } from 'next/navigation';

const DatasetList = ({ onCreate }: any) => {
  const { datasets, isCreating } = useDatasets();
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onCreate}
        className="relative group w-full flex flex-col items-center justify-center gap-2 p-3 max-w-sm min-h-48 rounded-md bg-base-content/5 border-dashed border-base-content/20 hover:bg-base-content/20 border cursor-pointer hover:shadow-box hover:shadow-gray-700"
      >
        <div className="text-5xl text-primary">
          {isCreating ? <div className="loading loading-xs" /> : '+'}
        </div>
        <div className="text-base font-bold">New Dataset</div>
      </button>
      {datasets.map((dataset) => (
        <DatasetCard key={dataset.id} dataset={dataset} />
      ))}
    </div>
  );
};

export default DatasetList;
