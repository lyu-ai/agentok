import { genId } from '@/utils/id';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTool } from '@/hooks';
import { RiDeleteBin4Line } from 'react-icons/ri';

const VariableRow = ({ variable, onDelete, showActions, onUpdate }: any) => {
  const t = useTranslations('tool.Variables');
  const [name, setName] = useState(variable.name ?? '');
  const [description, setDescription] = useState(variable.description ?? '');

  useEffect(() => {
    setName(variable.name ?? '');
    setDescription(variable.description ?? '');
  }, [variable?.name, variable?.description]);

  const handleBlur = (field: string, value: string) => {
    if (variable.id) {
      onUpdate(variable, field, value);
    }
  };

  return (
    <tr className="group flex items-center gap-1 w-full hover:bg-gray-700">
      <td className="w-48">
        <input
          type="text"
          value={name}
          placeholder={'VAR_NAME'}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => handleBlur('name', e.target.value)}
          className="input input-sm input-bordered bg-transparent rounded w-full"
        />
      </td>
      <td className="flex-grow">
        <input
          type="text"
          value={description}
          placeholder={t('variable-description')}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={(e) => handleBlur('description', e.target.value)}
          className="input input-sm input-bordered bg-transparent rounded w-full"
        />
      </td>
      <td className="w-16 flex justify-center">
        {showActions && (
          <button
            className="btn btn-xs btn-ghost btn-square hover:text-red-600"
            onClick={() => onDelete(variable)}
          >
            <RiDeleteBin4Line className="w-4 h-4" />
          </button>
        )}
      </td>
    </tr>
  );
};

const VariableList = ({ toolId, className, ...props }: any) => {
  const t = useTranslations('tool.Variables');
  const { tool, updateTool } = useTool(toolId);
  const [newVariable, setNewVariable] = useState({
    id: genId(),
    name: '',
    description: '',
    default_value: '',
  });

  const handleDelete = (variable: any) => {
    if (!tool) return;
    updateTool({
      variables: tool.variables.filter((v: any) => v.id !== variable.id),
    });
  };

  const handleUpdate = (variable: any, name: string, value: any) => {
    if (!variable) return;
    if (!tool) return;
    console.log('handleUpdate', variable, newVariable, name, value);
    if (variable.id === newVariable.id) {
      if (!name) return;
      // If the variable is the new variable, add it to the list
      const updatedVariable = { ...variable, [name]: value };
      setNewVariable({
        id: genId(),
        name: '',
        description: '',
        default_value: '',
      });
      updateTool({
        variables: [...tool.variables, updatedVariable],
      });
    } else {
      // Update existing variable
      updateTool({
        variables: tool.variables.map((v: any) =>
          v.id === variable.id ? { ...v, [name]: value } : v
        ),
      });
    }
  };

  return (
    <div
      className={clsx(
        'flex flex-col gap-1 overflow-x-auto p-2 border border-base-content/20 rounded',
        className
      )}
    >
      <div className="text-lg font-bold">{t('title')}</div>
      <div className="text-sm">{t('description')}</div>
      <table className="table table-xs border-transparent">
        <thead>
          <tr className="flex items-center gap-1 w-full">
            <th className="w-48">{t('variable-name')}</th>
            <th className="flex-grow">{t('variable-description')}</th>
            <th className="w-16 text-right">{t('variable-actions')}</th>
          </tr>
        </thead>
        <tbody>
          {tool?.variables?.map((variable: any, index: number) => (
            <VariableRow
              key={variable.id}
              variable={variable}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              showActions
            />
          ))}
          <VariableRow
            key={newVariable.id}
            variable={newVariable}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </tbody>
      </table>
    </div>
  );
};

export default VariableList;
