import { useReactFlow } from 'reactflow';
import { setNodeData } from '../../utils/flow';
import { genId } from '@/utils/id';
import { GoTrash, GoX } from 'react-icons/go';
import { MdOutlineAdd } from 'react-icons/md';
import { useTranslations } from 'next-intl';

const FunctionParams = ({ nodeId, func, ...props }: any) => {
  const t = useTranslations('function.Params');
  const instance = useReactFlow();
  const node = instance.getNode(nodeId);
  const onDeleteParam = (param: any) => {
    const newFunctions = node?.data?.functions?.map((f: any) => {
      if (f.id === func.id) {
        return {
          ...f,
          parameters: f.parameters.filter((p: any) => p.id !== param.id),
        };
      }
      return f;
    });
    setNodeData(instance, nodeId, { functions: newFunctions });
  };
  const onUpdateParam = (param: any, name: string, value: any) => {
    const newFunctions = node?.data?.functions?.map((f: any) => {
      if (f.id === func.id) {
        const newParams = f.parameters?.map((p: any) => {
          if (param && param.id === p.id) {
            return {
              ...p,
              [name]: value,
            };
          }
          return p;
        }); // explicitly remove undefined entries
        return {
          ...f,
          parameters: newParams,
        };
      }
      return f;
    });
    setNodeData(instance, nodeId, { functions: newFunctions });
  };
  const onAddParam = () => {
    const newFunctions = node?.data?.functions?.map((f: any) => {
      if (f.id === func.id) {
        return {
          ...f,
          parameters: [
            {
              id: 'param-' + genId(),
              name: 'newParam',
              type: 'string',
              description: 'new param description',
              required: true,
            },
            ...(f.parameters || []),
          ],
        };
      }
      return f;
    });
    setNodeData(instance, nodeId, { functions: newFunctions });
  };

  console.log('func?.parameters', func?.parameters);

  return (
    <div className="flex flex-col gap-2 overflow-x-auto p-2 border border-base-content/20 rounded">
      <div className="flex items-center justify-between">
        <div className="font-bold">{t('title')}</div>
        <button
          className="btn btn-sm btn-outline btn-ghost rounded"
          onClick={onAddParam}
        >
          <MdOutlineAdd className="w-4 h-4" />
          <span>{t('param-add')}</span>
        </button>
      </div>
      <table className="table table-xs border-transparent">
        <thead>
          <tr className="flex items-center w-full">
            <th className="w-16 px-0">{t('param-required')}</th>
            <th className="w-28 px-1">{t('param-name')}</th>
            <th className="w-24 px-1">{t('param-type')}</th>
            <th className="flex-grow px-1">{t('param-description')}</th>
            <th className="w-12 px-1 text-right">{t('param-actions')}</th>
          </tr>
        </thead>
        <tbody>
          {func?.parameters?.map((param: any, index: number) => (
            <tr
              key={index}
              className="group flex items-center w-full hover:bg-gray-700"
            >
              <td className="w-16 flex items-center px-1">
                <input
                  type="checkbox"
                  checked={param.required ?? false}
                  onChange={e =>
                    onUpdateParam(param, 'required', e.target.checked)
                  }
                />
              </td>
              <td className="w-28 px-1">
                <input
                  type="text"
                  value={param.name ?? ''}
                  onChange={e => onUpdateParam(param, 'name', e.target.value)}
                  className="input input-xs input-bordered bg-transparent rounded w-full"
                />
              </td>
              <td className="w-24 px-1">
                <select
                  className="select select-xs select-bordered bg-transparent rounded w-full"
                  value={param.type ?? 'string'}
                  onChange={e => onUpdateParam(param, 'type', e.target.value)}
                >
                  <option value="string">string</option>
                  <option value="number">number</option>
                  <option value="boolean">boolean</option>
                </select>
              </td>
              <td className="flex-grow px-0">
                <input
                  type="text"
                  value={param.description ?? ''}
                  onChange={e =>
                    onUpdateParam(param, 'description', e.target.value)
                  }
                  className="input input-xs input-bordered bg-transparent rounded w-full"
                />
              </td>
              <td className="w-12 flex text-right justify-end px-1">
                <div className="hidden group-hover:block w-full">
                  <button
                    className="btn btn-xs btn-square btn-ghost hover:text-red-600"
                    onClick={() => onDeleteParam(param)}
                  >
                    <GoTrash className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FunctionParams;
