import EditableText from '@/components/EditableText';
import { TbMathFunction } from 'react-icons/tb';
import ParamList from './ParamList';
import CodeEditor from './CodeEditor';
import { useProject } from '@/hooks';

const SkillDetail = ({ projectId, skill, ...props }: any) => {
  const { project, updateProject } = useProject(projectId);
  const setSkillData = (key: any, value: any) => {
    updateProject({
      skills: project?.skills?.map((f: any) => {
        if (f.id === skill.id) {
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
      <div className="flex items-start gap-2">
        <TbMathFunction className="w-7 h-7" />
        <div className="w-full flex flex-col gap-2 text-base">
          <div className="flex items-center w-full justify-between">
            <EditableText
              text={skill?.name}
              onChange={(text: any) => {
                setSkillData('name', text);
              }}
              showButtons
              className="text-base-content/80 !text-lg !font-bold"
            />
            <div className="flex items-center gap-2 text-sm">
              <span>Async Function</span>
              <input
                type="checkbox"
                checked={skill?.async ?? false}
                onChange={e => {
                  setSkillData('async', e.target.checked);
                }}
                className="toggle toggle-sm"
              />
            </div>
          </div>
          <EditableText
            text={skill?.description}
            onChange={(text: any) => {
              setSkillData('description', text);
            }}
            showButtons
            className="text-base-content/80 !text-base !font-normal"
          />
        </div>
      </div>
      <ParamList projectId={projectId} skill={skill} className="shrink-0" />
      <CodeEditor projectId={projectId} skill={skill} className="flex-grow" />
    </div>
  );
};

export default SkillDetail;
