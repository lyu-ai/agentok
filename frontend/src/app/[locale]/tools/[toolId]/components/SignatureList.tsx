import { genId } from "@/utils/id";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useTool } from "@/hooks";
import { RiAddLargeLine, RiCloseLine } from "react-icons/ri";

const SignatureRow = ({ signature, handleDelete, handleUpdate }: any) => {
  const [name, setName] = useState(signature.name ?? "");
  const [description, setDescription] = useState(signature.description ?? "");
  useEffect(() => {
    setName(signature.name ?? "");
    setDescription(signature.description ?? "");
  }, [signature?.name, signature?.description]);

  return (
    <tr className="group flex items-center w-full hover:bg-gray-700">
      <td className="w-20 flex items-center px-1">
        <input
          type="checkbox"
          checked={signature.required ?? false}
          onChange={(e) => handleUpdate(signature, "required", e.target.checked)}
        />
      </td>
      <td className="w-36 px-1">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => handleUpdate(signature, "name", e.target.value)}
          className="input input-sm input-bordered bg-transparent rounded w-full"
        />
      </td>
      <td className="w-32 px-1">
        <select
          className="select select-sm select-bordered bg-transparent rounded w-full"
          value={signature.type ?? "str"}
          onChange={(e) => handleUpdate(signature, "type", e.target.value)}
        >
          <option value="str">str</option>
          <option value="int">int</option>
          <option value="float">float</option>
          <option value="bool">bool</option>
        </select>
      </td>
      <td className="flex-grow px-1">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={(e) => handleUpdate(signature, "description", e.target.value)}
          className="input input-sm input-bordered bg-transparent rounded w-full"
        />
      </td>
      <td className="w-12 flex text-right justify-end px-1">
        <div className="w-full">
          <button
            className="btn btn-xs btn-square rounded hover:text-red-600"
            onClick={() => handleDelete(signature)}
          >
            <RiCloseLine className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const SignatureList = ({ toolId, className, ...props }: any) => {
  const t = useTranslations("tool.Signatures");
  const { tool, updateTool } = useTool(toolId);
  const handleDelete = (signature: any) => {
    if (!tool) return;
    updateTool({
      signatures: tool.signatures.filter((s: any) => s.id !== signature.id),
    });
  };
  const handleUpdate = (signature: any, name: string, value: any) => {
    updateTool({
      signatures: tool?.signatures.map((s) => {
        if (s.id === signature.id) {
          return { ...s, [name]: value };
        }
        return s;
      }),
    });
  };
  const handleCreate = () => {
    if (!tool) return;
    updateTool({
      signatures: [
        ...(tool.signatures || []),
        {
          id: genId(),
          name: "newParam",
          type: "str",
          description: "new signature description",
        },
      ],
    });
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-2 overflow-x-auto p-2 border border-base-content/20 rounded",
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
          <span>{t("signature-create")}</span>
        </button>
      </div>
      <table className="table table-xs border-transparent">
        <thead>
          <tr className="flex items-center w-full">
            <th className="w-20 px-1">{t("signature-required")}</th>
            <th className="w-36 px-1">{t("signature-name")}</th>
            <th className="w-32 px-1">{t("signature-type")}</th>
            <th className="flex-grow px-1">{t("signature-description")}</th>
            <th className="w-12 px-1 text-right">{t("signature-actions")}</th>
          </tr>
        </thead>
        <tbody>
          {tool?.signatures?.map((signature: any, index: number) => (
            <SignatureRow
              signature={signature}
              key={index}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SignatureList;
