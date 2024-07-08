import EditableText from '@/components/EditableText';
import { RiFormula } from 'react-icons/ri';
import ParamList from './ParamList';
import CodeEditor from './CodeEditor';
import { useProject } from '@/hooks';
import Tip from '@/app/[locale]/components/Tip';

const ToolDetail = ({ projectId, tool, ...props }: any) => {
  const { project, updateProject } = useProject(projectId);
  const setToolData = (key: any, value: any) => {
    updateProject({
      tools: project?.tools?.map((f: any) => {
        if (f.id === tool.id) {
          return {
            ...f,
            [key]: value,
          };
        }
        return f;
      }),
    });
  };
  return (
    <div className="relative flex flex-col w-full gap-2 p-2 h-full overflow-y-auto">
      <div className="flex items-center gap-1">
        <RiFormula className="w-7 h-7" />
        <div className="flex items-center w-full justify-between">
          <EditableText
            text={tool?.name}
            onChange={(text: any) => {
              setToolData('name', text);
            }}
            showButtons
            className="text-base-content/80 !text-lg !font-bold"
          />
        </div>
      </div>
      <EditableText
        text={tool?.description}
        onChange={(text: any) => {
          setToolData('description', text);
        }}
        showButtons
        className="text-base-content/80 !text-base !font-normal"
      />
      <ParamList projectId={projectId} tool={tool} className="shrink-0" />
      <div className="flex items-center w-full justify-end gap-2 text-sm px-2">
        <span>Asynchronous Tool-call</span>
        <input
          type="checkbox"
          checked={tool?.async ?? false}
          onChange={e => {
            setToolData('async', e.target.checked);
          }}
          className="toggle toggle-sm"
        />
        <Tip content="Enable this option will add async keyword to the generated python function." />
      </div>
      <CodeEditor projectId={projectId} tool={tool} className="flex-grow" />
    </div>
  );
};

export default ToolDetail;
