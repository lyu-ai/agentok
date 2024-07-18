import { genId } from '@/utils/id';
import { GoTrash } from 'react-icons/go';
import { MdOutlineAdd } from 'react-icons/md';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useProject } from '@/hooks';
import {
  RiAddLargeLine,
  RiCloseLargeLine,
  RiCloseLine,
  RiCrossLine,
} from 'react-icons/ri';

const ParamRow = ({ param, onDelete, onUpdate }: any) => {
  const [name, setName] = useState(param.name ?? '');
  const [description, setDescription] = useState(param.description ?? '');
  useEffect(() => {
    setName(param.name ?? '');
    setDescription(param.description ?? '');
  }, [param?.name, param?.description]);

  return (
    <tr className="group flex items-center w-full hover:bg-gray-700">
      <td className="w-20 flex items-center px-1">
        <input
          type="checkbox"
          checked={param.required ?? false}
          onChange={e => onUpdate(param, 'required', e.target.checked)}
        />
      </td>
      <td className="w-36 px-1">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={e => onUpdate(param, 'name', e.target.value)}
          className="input input-sm input-bordered bg-transparent rounded w-full"
        />
      </td>
      <td className="w-32 px-1">
        <select
          className="select select-sm select-bordered bg-transparent rounded w-full"
          value={param.type ?? 'str'}
          onChange={e => onUpdate(param, 'type', e.target.value)}
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
          onChange={e => setDescription(e.target.value)}
          onBlur={e => onUpdate(param, 'description', e.target.value)}
          className="input input-sm input-bordered bg-transparent rounded w-full"
        />
      </td>
      <td className="w-12 flex text-right justify-end px-1">
        <div className="w-full">
          <button
            className="btn btn-xs btn-square rounded hover:text-red-600"
            onClick={() => onDelete(param)}
          >
            <RiCloseLine className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ParamList = ({ projectId, tool, className, ...props }: any) => {
  const t = useTranslations('tool.Params');
  const { project, updateProject } = useProject(projectId);
  const onDelete = (param: any) => {
    const newTools = project?.tools?.map((s: any) => {
      if (s.id === tool.id) {
        return {
          ...s,
          parameters: s.parameters.filter((p: any) => p.id !== param.id),
        };
      }
      return s;
    });
    updateProject({ tools: newTools });
  };
  const onUpdate = (param: any, name: string, value: any) => {
    const newTools = project?.tools?.map((s: any) => {
      if (s.id === tool.id) {
        const newParams = s.parameters?.map((p: any) => {
          if (param && param.id === p.id) {
            return {
              ...p,
              [name]: value,
            };
          }
          return p;
        }); // explicitly remove undefined entries
        return {
          ...s,
          parameters: newParams,
        };
      }
      return s;
    });
    updateProject({ tools: newTools });
  };
  const onAddParam = () => {
    const newTools = project?.tools?.map((s: any) => {
      if (s.id === tool.id) {
        return {
          ...s,
          parameters: [
            ...(s.parameters || []),
            {
              id: 'param-' + genId(),
              name: 'newParam',
              type: 'string',
              description: 'new param description',
              required: true,
            },
          ],
        };
      }
      return s;
    });
    updateProject({ tools: newTools });
  };

  return (
    <div
      className={clsx(
        'flex flex-col gap-2 overflow-x-auto p-2 border border-base-content/20 rounded',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="font-bold">{t('title')}</div>
        <button
          className="btn btn-sm btn-outline btn-ghost rounded"
          onClick={onAddParam}
        >
          <RiAddLargeLine className="w-4 h-4" />
          <span>{t('param-add')}</span>
        </button>
      </div>
      <table className="table table-xs border-transparent">
        <thead>
          <tr className="flex items-center w-full">
            <th className="w-20 px-1">{t('param-required')}</th>
            <th className="w-36 px-1">{t('param-name')}</th>
            <th className="w-32 px-1">{t('param-type')}</th>
            <th className="flex-grow px-1">{t('param-description')}</th>
            <th className="w-12 px-1 text-right">{t('param-actions')}</th>
          </tr>
        </thead>
        <tbody>
          {tool?.parameters?.map((param: any, index: number) => (
            <ParamRow
              param={param}
              key={index}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParamList;
