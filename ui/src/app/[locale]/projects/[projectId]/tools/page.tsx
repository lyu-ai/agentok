'use client'; // Ensures this file is treated as a client component
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { RiFormula } from 'react-icons/ri';
import SharedToolList from './components/SharedToolList';
import { genId } from '@/utils/id';
import { useProject, useSharedTools } from '@/hooks';
import { toast } from 'react-toastify';

const Page = ({ params }: { params: { projectId: string } }) => {
  const t = useTranslations('tool.Config');
  const { project, updateProject } = useProject(params.projectId);
  const { tools: sharedTools } = useSharedTools();
  const router = useRouter();

  const onFork = async (sharedToolId: any) => {
    const sharedTool = sharedTools.find(t => t.id === sharedToolId);
    if (!sharedTool || !sharedTool.tool) {
      toast.error(`Shared tool ${sharedToolId} not found.`);
      console.error(`Shared tool ${sharedToolId} not found.`);
      return;
    }
    const newToolId = 't' + genId();
    await updateProject({
      tools: [
        {
          ...sharedTool.tool,
          id: newToolId,
        },
        ...(project?.tools ?? []),
      ],
    })
      .then(() => {
        router.push(`/projects/${params.projectId}/tools/${newToolId}`);
      })
      .catch(err => console.error(err));
  };
  return (
    <div className="flex flex-col w-full gap-4 p-2 flex-grow h-full overflow-y-auto">
      <div className="flex flex-col items-center gap-3 w-full text-center">
        <RiFormula className="w-16 h-16 text-primary" />
        {t('tool-prompt')}
        <SharedToolList onFork={onFork} />
      </div>
    </div>
  );
};

export default Page;
