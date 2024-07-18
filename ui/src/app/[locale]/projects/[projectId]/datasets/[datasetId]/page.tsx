'use client';
import { useProject } from '@/hooks';
import ToolDetail from './components/Detail';

const Page = ({
  params,
}: {
  params: { projectId: number; toolId: number };
}) => {
  const { project } = useProject(params.projectId);
  return (
    <ToolDetail
      projectId={params.projectId}
      tool={project?.tools?.find(t => t.id === params.toolId)}
    />
  );
};

export default Page;
