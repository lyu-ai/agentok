import Markdown from 'react-markdown';
import { useToolSettings } from '@/hooks';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Input } from '../ui/input';
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
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
      <Input
        type="text"
        value={value ?? ''}
        onChange={(v) => setValue(v.target.value)}
        onBlur={(v) => handleVariableChange(variable.name, v.target.value)}
        className="input input-primary input-sm rounded"
      />
    </div>
  );
};

export const ToolConfig = ({ tool, open, onOpenChange }: any) => {
  if (!tool) {
    return (
      <div className="w-full h-full justify-center items-center flex">
        Tool not found
      </div>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full h-full gap-2 p-2">
        <SheetHeader className="flex flex-col w-full gap-4  border-b py-4 border-base-content/10">
          <SheetTitle className="flex items-center gap-2">
            <Image
              src={tool.logo_url ?? '/images/tools.svg'}
              alt={tool.name}
              width={64}
              height={64}
              className="w-16 h-16 flex-shrink-0"
            />
            <div className="flex flex-col gap-2">
              <span className="text-lg font-bold">{tool.name}</span>
              {tool.user_name && (
                <div className="flex items-center gap-1">
                  <Image
                    src={tool.user_avatar}
                    alt={tool.user_name}
                    width={16}
                    height={16}
                    className="w-4 h-4 rounded-full"
                  />
                  <span className="flex items-center gap-1 text-xs">
                    <a
                      href={`mailto:${tool.user_email}`}
                      className="link link-hover"
                    >
                      <SheetDescription>{tool.user_name}</SheetDescription>
                    </a>
                  </span>
                </div>
              )}
            </div>
          </SheetTitle>
          <Markdown className="text-sm">{tool.description}</Markdown>
        </SheetHeader>
        {tool.variables.length > 0 ? (
          <div className="flex flex-col gap-2">
            {tool.variables.map((variable: any, index: any) => (
              <VariableConfig key={index} tool={tool} variable={variable} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center text-base-content/50 w-full h-full">
            No variables
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
