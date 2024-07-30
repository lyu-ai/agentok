'use client'; // Ensures this file is treated as a client component
import { useTranslations } from 'next-intl';
import DatasetList from './components/DatasetList';
import UnderConstruction from '@/components/UnderConstruction';

const Page = () => {
  const t = useTranslations('page.Datasets');

  return (
    <div className="flex flex-col w-full gap-4 p-2 flex-grow h-full overflow-y-auto">
      {/* <DatasetList /> */}
      <UnderConstruction />
    </div>
  );
};

export default Page;
