'use client'; // Ensures this file is treated as a client component
import { useTranslations } from 'next-intl';
import DatasetList from './components/DatasetList';

const Page = ({ params }: { params: { projectId: string } }) => {
  const projectId = parseInt(params.projectId, 10);
  const t = useTranslations('page.Datasets');

  return (
    <div className="flex flex-col w-full gap-4 p-2 flex-grow h-full overflow-y-auto">
      <DatasetList projectId={projectId} />
    </div>
  );
};

export default Page;
