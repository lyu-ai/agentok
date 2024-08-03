'use client'; // Ensures this file is treated as a client component
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { RiFormula } from 'react-icons/ri';
import { useSharedTools, useTools } from '@/hooks';
import { toast } from 'react-toastify';

const Page = () => {
  const t = useTranslations('tool.Config');
  const { tools: sharedTools } = useSharedTools();
  const { createTool } = useTools();
  const router = useRouter();

  const onFork = async (sharedToolId: any) => {
    const sharedTool = sharedTools.find(t => t.id === sharedToolId);
    if (!sharedTool) {
      toast.error(`Shared tool ${sharedToolId} not found.`);
      console.error(`Shared tool ${sharedToolId} not found.`);
      return;
    }
    const { id, ...newTool  } = sharedTool;
    await createTool(newTool)
      .then(tool => {
        router.push(`/tools/${tool.id}`);
      })
      .catch(err => console.error(err));
  };
  return (
    <div className="flex flex-col w-full gap-4 p-2 flex-grow h-full overflow-y-auto">
      <div className="flex flex-col items-center gap-3 w-full h-full text-center justify-center">
        <RiFormula className="w-16 h-16 text-primary" />
        {t('tool-prompt')}
        {/* <SharedToolList onFork={onFork} /> */}
      </div>
    </div>
  );
}

export default Page;
