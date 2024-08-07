"use client";
import EditableText from "@/components/EditableText";
import CodeEditor from "./components/CodeEditor";
import VariableList from "./components/VariableList";
import { useTool } from "@/hooks";
import { useTranslations } from "next-intl";
import ImageUploader from "@/components/ImageUploader";

const Page = ({ params }: { params: { toolId: string } }) => {
  const toolId = parseInt(params.toolId, 10);

  const t = useTranslations("page.Tools");
  const { tool, updateTool } = useTool(toolId);
  const setToolData = (key: any, value: any) => {
    updateTool({ [key]: value });
  };
  if (!tool) return null;
  return (
    <div className="relative flex flex-col w-full gap-1 h-full overflow-y-auto">
      <div className="flex flex-col gap-1 p-2 border border-base-content/20 rounded">
        <div className="flex items-start justify-between w-full gap-1">
          <div className="flex items-center gap-2">
            <ImageUploader
              imageUrl={tool.logo_url ?? "/images/tools-solid.svg"}
              storagePath="/images/tools"
              onUpdate={(url) => setToolData("logo_url", url)}
              className="w-20 h-20 flex-shrink-0 rounded"
            />
            <div className="flex flex-col gap-1">
              <EditableText
                text={tool?.name}
                onChange={(text: any) => {
                  setToolData("name", text);
                }}
                showButtons
                className="text-base-content !text-lg !font-bold"
              />
              <EditableText
                text={tool?.description ?? ""}
                onChange={(text: any) => {
                  setToolData("description", text);
                }}
                showButtons
                className="text-base-content/80 !text-sm !font-normal"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm px-2">
            <span className="no-wrap">{t("make-public")}</span>
            <input
              type="checkbox"
              checked={tool.is_public}
              onChange={(e) => setToolData("is_public", e.target.checked)}
              className="toggle toggle-primary toggle-sm"
            />
          </div>
        </div>
      </div>
      <VariableList toolId={toolId} className="shrink-0" />
      <CodeEditor toolId={toolId} className="flex-grow min-h-80" />
    </div>
  );
};

export default Page;
