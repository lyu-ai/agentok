import { useProject } from '@/hooks';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { GenericOption } from '../flow/option/option';

export const ProjectConfig = ({ projectId }: { projectId: number }) => {
  const { project, updateProject } = useProject(projectId);
  const handleChange = (name: string, value: any) => {
    updateProject({ [name]: value }).catch(console.error);
  };
  return (
    <ScrollArea className="h-full p-2">
      <div className="flex flex-col gap-4">
        <GenericOption
          nodeId={projectId.toString()}
          type="text"
          name="name"
          label="Name"
          value={project?.name}
          onValueChange={handleChange}
        />
        <GenericOption
          nodeId={projectId.toString()}
          type="text"
          rows={5}
          name="description"
          label="Description"
          value={project?.description}
          onValueChange={handleChange}
        />
      </div>
    </ScrollArea>
  );
};
