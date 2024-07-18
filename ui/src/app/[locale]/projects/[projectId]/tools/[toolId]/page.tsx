'use client';
import { useProject } from '@/hooks';
import ToolDetail from './components/Detail';

const Page = ({
  params,
}: {
  params: { projectId: string; toolId: string };
}) => {
  const projectId = parseInt(params.projectId, 10);
  const toolId = parseInt(params.toolId, 10);
  const { project } = useProject(projectId);

  const tool = project?.tools?.find(t => t.id === toolId);
  if (!tool) {
    return null;
  }
  return (
    <ToolDetail
      projectId={params.projectId}
      tool={tool}
    />
  );
};

export default Page;
