'use client'; // Ensures this file is treated as a client component
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { genId } from '@/utils/id';
import { useProject } from '@/hooks';
import { toast } from 'react-toastify';
import DatasetList from './components/DatasetList';

const Page = ({ params }: { params: { projectId: string } }) => {
  const projectId = parseInt(params.projectId, 10);
  const t = useTranslations('page.Datasets');
  const { project, updateProject } = useProject(projectId);
  const router = useRouter();

  return (
    <div className="flex flex-col w-full gap-4 p-2 flex-grow h-full overflow-y-auto">
        <DatasetList />
    </div>
  );
};

export default Page;
