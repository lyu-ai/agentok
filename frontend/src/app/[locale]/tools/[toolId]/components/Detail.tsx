import EditableText from "@/components/EditableText";
import { RiFormula, RiSparklingLine } from "react-icons/ri";
import CodeEditor from "./CodeEditor";
import VariableList from "./VariableList";
import { useTool } from "@/hooks";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const ToolDetail = ({ toolId, ...props }: any) => {
  const t = useTranslations("tool.Detail");
  const [showVariables, setShowVariables] = useState(false);
  const { tool, updateTool } = useTool(toolId);
  useEffect(() => {
    if (!tool) return;
    if (tool.variables && tool.variables.length > 0) {
      setShowVariables(true);
    }
  }, [tool]);
  const setToolData = (key: any, value: any) => {
    updateTool({ [key]: value });
  };
  if (!tool) return null;
  return (
    <div
      className="relative flex flex-col w-full gap-1 h-full overflow-y-auto"
      {...props}
    >
      <div className="flex items-center justify-between w-full gap-1">
        <div className="flex items-center justify-between">
          <RiFormula className="w-7 h-7" />
          <EditableText
            text={tool?.name}
            onChange={(text: any) => {
              setToolData("name", text);
            }}
            className="text-base-content/80 !text-lg !font-bold"
          />
        </div>
        <div className="flex items-center gap-2 text-sm px-2">
          <span className="no-wrap">{t("show-variables")}</span>
          <input
            type="checkbox"
            checked={showVariables}
            onChange={(e) => setShowVariables(e.target.checked)}
            className="toggle toggle-sm"
          />
        </div>
      </div>
      <EditableText
        text={tool?.description ?? ""}
        onChange={(text: any) => {
          setToolData("description", text);
        }}
        className="text-base-content/80 !text-base !font-normal"
      />
      {showVariables && <VariableList toolId={toolId} className="shrink-0" />}
      <CodeEditor toolId={toolId} className="flex-grow min-h-80" />
    </div>
  );
};

export default ToolDetail;
