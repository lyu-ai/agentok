'use client';
import { EditableText } from '@/components/editable-text';
import CodeEditor from '../../../components/tool/code-editor';
import VariableList from '../../../components/tool/variable-list';
import { useTool } from '@/hooks';
import { ImageUploader } from '@/components/image-uploader';
import { use } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const toolId = parseInt(id, 10);

  const { tool, updateTool } = useTool(toolId);
  const setToolData = (key: string, value: unknown) => {
    updateTool({ [key]: value });
  };

  if (!tool) return null;

  return (
    <div className="relative flex flex-col w-full gap-1 h-full overflow-y-auto">
      <div className="flex flex-col gap-1 p-2 border border-base-content/20 rounded">
        <div className="flex items-start justify-between w-full gap-1">
          <div className="flex items-center gap-2">
            <ImageUploader
              imageUrl={tool.logo_url ?? '/images/tools.svg'}
              onImageUpload={async (attachment) => {
                setToolData('logo_url', attachment.url);
              }}
              className="w-20 h-20 flex-shrink-0 rounded"
            />
            <div className="flex flex-col gap-1">
              <EditableText
                text={tool.name}
                onChange={(text: string) => {
                  setToolData('name', text);
                }}
                showButtons
                className="text-base-content !text-lg !font-bold"
              />
              <EditableText
                text={tool.description ?? ''}
                onChange={(text: string) => {
                  setToolData('description', text);
                }}
                showButtons
                className="text-base-content/80 !text-sm !font-normal"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm px-2">
            <Label htmlFor="is_public" className="no-wrap">
              Public
            </Label>
            <Switch
              id="is_public"
              checked={tool.is_public}
              onCheckedChange={(checked: boolean) =>
                setToolData('is_public', checked)
              }
            />
          </div>
        </div>
      </div>
      <VariableList toolId={toolId} className="shrink-0" />
      <CodeEditor toolId={toolId} className="flex-grow min-h-[400px]" />
    </div>
  );
}
