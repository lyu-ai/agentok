'use client';
import { EditableText } from '@/components/editable-text';
import CodeEditor from '../../../components/tool/code-editor';
import VariableList from '../../../components/tool/variable-list';
import { useTool } from '@/hooks';
import { ImageUploader } from '@/components/image-uploader';
import { use } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardTitle, CardContent, CardHeader } from '@/components/ui/card';
import { useCallback } from 'react';

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const toolId = parseInt(id, 10);
  const { tool, updateTool } = useTool(toolId);

  const setToolData = useCallback(
    (key: string, value: unknown) => {
      updateTool({ [key]: value });
    },
    [updateTool]
  );

  if (!tool) return null;

  return (
    <div className="relative flex flex-col w-full gap-1 h-full overflow-y-auto">
      <Card className="flex flex-col gap-1 p-2 bg-background">
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
              checked={!!tool.is_public}
              onCheckedChange={(checked: boolean) =>
                setToolData('is_public', checked)
              }
            />
          </div>
        </div>
      </Card>
      <VariableList toolId={toolId} className="shrink-0 bg-background" />
      <Card className="flex flex-col flex-1 bg-background h-full">
        <CardHeader>
          <CardTitle>Code</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <CodeEditor toolId={toolId} className="h-full min-h-[400px]" />
        </CardContent>
      </Card>
    </div>
  );
}
