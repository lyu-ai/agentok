'use client'; // Ensures this file is treated as a client component
import { useTranslations } from 'next-intl';
import DatasetList from './components/DatasetList';
import { RiDatabase2Line } from 'react-icons/ri';
import { useDatasets } from '@/hooks';
import { toast } from 'react-toastify';
import DatasetConfig from './components/DatasetConfig';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Page = () => {
  const router = useRouter();
  const { createDataset } = useDatasets();
  const t = useTranslations('page.Datasets');
  const [showNewDatasetDialog, setShowNewDatasetDialog] = useState(false);
  const handleCreateDataset = async (name: string, description: string) => {
    const dataset = await createDataset({
      name: name || 'New Dataset',
      description: description || 'Description of New Dataset.',
    });
    if (!dataset) {
      toast.error('Failed to create dataset');
      return;
    }
    // Navigate to the new dataset
    router.push(`/datasets/${dataset.id}`);
  };

  return (
    <div className="flex flex-col w-full gap-4 p-2 flex-grow h-full overflow-y-auto">
      <div className="flex items-center gap-4 p-2 border-b border-base-content/10">
        <RiDatabase2Line className="w-12 h-12" />
        <div className="flex flex-col gap-2">
          <div className="text-2xl font-bold">{t('title')}</div>
          <div className="">{t('description')}</div>
        </div>
      </div>
      <DatasetList onCreate={() => setShowNewDatasetDialog(true)} />
      <DatasetConfig
        show={showNewDatasetDialog}
        onClose={() => setShowNewDatasetDialog(false)}
        onApply={handleCreateDataset}
      />
    </div>
  );
};

export default Page;
