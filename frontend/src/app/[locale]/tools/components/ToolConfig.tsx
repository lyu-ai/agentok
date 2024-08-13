import { useTranslations } from 'next-intl';
import Markdown from 'react-markdown';
import { useToolSettings } from '@/hooks';
import { useEffect, useState } from 'react';

const VariableConfig = ({ tool, variable, onChange }: any) => {
  const { settings, updateSettings } = useToolSettings();
  const [value, setValue] = useState('');
  useEffect(() => {
    const existingSettings = settings[tool.id] ?? {};
    setValue(existingSettings.variables?.[variable.name] ?? '');
  }, [settings, tool.id, variable.name]);

  const handleVariableChange = (name: any, value: any) => {
    console.log(name, value);
    const existingSettings = settings[tool.id] ?? {};
    const newToolSettings = {
      ...existingSettings,
      variables: {
        ...existingSettings.variables,
        [name]: value,
      },
    };
    updateSettings({ ...settings, [tool.id]: newToolSettings });
    onChange && onChange(name, value);
  };

  return (
    <div className="flex flex-col gap-2 py-2">
      <span className="font-bold">{variable.name}</span>
      {variable.description && (
        <Markdown className="text-sm text-base-content/60">
          {variable.description}
        </Markdown>
      )}
      <input
        type="text"
        value={value ?? ''}
        onChange={(v) => setValue(v.target.value)}
        onBlur={(v) => handleVariableChange(variable.name, v.target.value)}
        className="input input-primary input-sm rounded"
      />
    </div>
  );
};

const ToolConfig = ({ tool }: any) => {
  const t = useTranslations('tool.Config');
  if (!tool) {
    return (
      <div className="w-full h-full justify-center items-center flex">
        {t('tool-not-found')}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full gap-2 p-2">
      <div className="flex items-center gap-2 border-b py-4 border-base-content/10">
        <img
          src={tool.logo_url ?? '/images/tools.svg'}
          className="w-12 h-12 flex-shrink-0"
        />
        <div className="flex flex-col gap-2">
          <span className="font-bold">{tool.name}</span>
          <Markdown className="text-sm">{tool.description}</Markdown>
        </div>
      </div>
      {tool.variables.length > 0 ? (
        <div className="flex flex-col gap-2">
          {tool.variables.map((variable: any, index: any) => (
            <VariableConfig key={index} tool={tool} variable={variable} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center text-base-content/50 w-full h-full">
          {t('no-variables')}
        </div>
      )}
    </div>
  );
};

export default ToolConfig;