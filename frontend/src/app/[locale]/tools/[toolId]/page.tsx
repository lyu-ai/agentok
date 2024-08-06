"use client";
import EditableText from "@/components/EditableText";
import { RiFormula } from "react-icons/ri";
import CodeEditor from "./components/CodeEditor";
import VariableList from "./components/VariableList";
import { useTool } from "@/hooks";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

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
        <div className="flex items-center justify-between w-full gap-1">
          <div className="flex items-center justify-between">
            <RiFormula className="w-7 h-7" />
            <EditableText
              text={tool?.name}
              onChange={(text: any) => {
                setToolData("name", text);
              }}
              showButtons
              className="text-base-content/80 !text-lg !font-bold"
            />
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
        <EditableText
          text={tool?.description ?? ""}
          onChange={(text: any) => {
            setToolData("description", text);
          }}
          showButtons
          className="text-base-content/80 !text-base !font-normal"
        />
      </div>
      <VariableList toolId={toolId} className="shrink-0" />
      <CodeEditor toolId={toolId} className="flex-grow min-h-80" />
    </div>
  );
};

export default Page;
