import { genId } from "@/utils/id";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useTool } from "@/hooks";
import { RiAddLargeLine, RiCloseLine } from "react-icons/ri";
import Tip from "@/components/Tip";

const VariableRow = ({ variable, onDelete, onUpdate }: any) => {
  const t = useTranslations("tool.Variables");
  const [name, setName] = useState(variable.name ?? "");
  const [description, setDescription] = useState(variable.description ?? "");
  const [defaultValue, setDefaultValue] = useState(variable.default_value ?? "");
  useEffect(() => {
    setName(variable.name ?? "");
    setDescription(variable.description ?? "");
  }, [variable?.name, variable?.description]);

  return (
    <tr className="group flex items-center w-full hover:bg-gray-700">
      <td className="w-36 px-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => onUpdate(variable, "name", e.target.value)}
          className="input input-sm input-bordered bg-transparent rounded w-full"
        />
      </td>
      <td className="flex-grow px-1">
        <input
          type="text"
          value={description}
          placeholder={t("variable-description")}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={(e) => onUpdate(variable, "description", e.target.value)}
          className="input input-sm input-bordered bg-transparent rounded w-full"
        />
      </td>
      <td className="w-48 px-1">
        <input
          type="text"
          value={defaultValue}
          placeholder={t("default-value")}
          onChange={(e) => setDefaultValue(e.target.value)}
          onBlur={(e) => onUpdate(variable, "default_value", e.target.value)}
          className="input input-sm input-bordered bg-transparent rounded w-full"
        />
      </td>
      <td className="w-12 flex text-right justify-end px-1">
        <div className="w-full">
          <button
            className="btn btn-xs btn-square rounded hover:text-red-600"
            onClick={() => onDelete(variable)}
          >
            <RiCloseLine className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const VariableList = ({ toolId, className, ...props }: any) => {
  const t = useTranslations("tool.Variables");
  const { tool, updateTool } = useTool(toolId);
  const handleDelete = (variable: any) => {
    if (!tool) return;
    updateTool({
      variables: tool.variables.filter((v: any) => v.id !== variable.id),
    });
  };
  const handleUpdate = (variable: any, name: string, value: any) => {
    if (!tool) return;
    updateTool({
      variables: tool.variables?.map((v: any) => {
        if (variable && variable.id === v.id) {
          return {
            ...v,
            [name]: value,
          };
        }
        return v;
      }), // explicitly remove undefined entries
    });
  };
  const handleCreate = () => {
    if (!tool) return;
    updateTool({
      variables: [
        ...(tool.variables || []),
        {
          id: genId(),
          name: "VAR_NAME",
          description: "New variable description",
          value: "",
        },
      ],
    });
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-1 overflow-x-auto p-2 border border-base-content/20 rounded",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="font-bold">{t("title")}</div>
        <button
          className="btn btn-sm btn-outline btn-ghost rounded"
          onClick={handleCreate}
        >
          <RiAddLargeLine className="w-4 h-4" />
          <span>{t("variable-create")}</span>
        </button>
      </div>
      <table className="table table-xs border-transparent">
        <thead>
          <tr className="flex items-center w-full">
            <th className="w-36 px-1">{t("variable-name")}</th>
            <th className="flex-grow px-1">{t("variable-description")}</th>
            <th className="flex items-center gap-1 w-36 px-1">{t("default-value")}<Tip content={t('default-value-tip')} /></th>
            <th className="w-12 px-1 text-right">{t("variable-actions")}</th>
          </tr>
        </thead>
        <tbody>
          {tool?.variables?.map((variable: any, index: number) => (
            <VariableRow
              key={index}
              variable={variable}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VariableList;
