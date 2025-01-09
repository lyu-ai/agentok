'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { GenericOption } from '../option/option';
import { Icons } from '@/components/icons';
import { ToolPicker } from '@/components/tool/tool-picker';
import { setEdgeData } from '@/lib/flow';
import { useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { usePublicTools, useTool, useTools } from '@/hooks';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tool } from '@/store/tools';

const ToolBlock = ({ toolId, onDelete }: any) => {
  const { tools } = useTools();
  const { tools: publicTools } = usePublicTools();
  const tool =
    tools.find((t) => t.id === toolId) ||
    publicTools.find((t) => t.id === toolId);
  return (
    <Card className="flex flex-col gap-2 p-2 w-full">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex items-center gap-2 w-full">
          <Avatar className="w-6 h-6">
            <AvatarImage src={tool?.logo_url} />
            <AvatarFallback>
              {tool?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{tool?.name}</span>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'text-xs',
            tool?.is_public ? 'bg-blue-500/20' : 'bg-green-500/20'
          )}
        >
          {tool?.is_public ? 'Public' : 'Private'}
        </Badge>
      </div>
      <span className="text-xs text-muted-foreground">{tool?.description}</span>
      <div className="flex items-center justify-end gap-2 w-full">
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7"
          onClick={() => onDelete?.(toolId)}
        >
          <Icons.trash className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </Card>
  );
};

export const ConverseConfig = ({ edgeId, data }: any) => {
  const instance = useReactFlow();
  const onAddTool = (toolId: any) => {
    // Check if toolId already exists in the array
    if (data?.tools?.includes(toolId)) {
      return; // Exit if tool already exists
    }

    setEdgeData(instance, edgeId, {
      tools: [...(data?.tools || []), toolId],
    });
  };
  const onDeleteTool = (toolId: any) => {
    setEdgeData(instance, edgeId, {
      tools: (data?.tools || []).filter((t: any) => t !== toolId),
    });
  };
  return (
    <ScrollArea>
      <div className="flex flex-col gap-4 p-2">
        <GenericOption
          type="text"
          key={`${edgeId}-instructions`}
          nodeId={edgeId}
          data={data}
          rows={2}
          name="instructions"
          label="Instructions"
          placeholder="Enter a prompt for the instructions. This can be overridden with command arguments."
        />
        <GenericOption
          key={`${edgeId}-mode`}
          type="select"
          nodeId={edgeId}
          data={data}
          name="mode"
          label="Mode"
          options={[
            { value: 'auto', label: 'Auto' },
            { value: 'manual', label: 'Manual' },
          ]}
        />
        <GenericOption
          key={`${edgeId}-allow-repeat`}
          type="check"
          nodeId={edgeId}
          data={data}
          name="allow_repeat"
          label="Allow Repeat"
        />
        <GenericOption
          key={`${edgeId}-summary-method`}
          type="select"
          nodeId={edgeId}
          data={data}
          name="summary_method"
          label="Summary Method"
          options={[
            { value: 'last_msg', label: 'Last Message' },
            { value: 'reflection_with_llm', label: 'Reflection with LLM' },
          ]}
        />
        <GenericOption
          key={`${edgeId}-summary-prompt`}
          type="text"
          nodeId={edgeId}
          data={data}
          rows={3}
          name="summary_prompt"
          label="Summary Prompt"
          placeholder="Enter a prompt for the summary."
        />
        <GenericOption
          key={`${edgeId}-max-turns`}
          type="range"
          nodeId={edgeId}
          data={data}
          name="max_turns"
          label="Max Turns"
          min={1}
          max={50}
          step={1}
        />
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="text-sm font-medium">Tools</span>
            <ToolPicker
              onAddTool={onAddTool}
              button={
                <Button size="sm" className="h-7">
                  <Icons.add className="w-4 h-4" />
                  Add Tool
                </Button>
              }
            />
          </div>
          {data?.tools ? (
            <div className="flex flex-col items-center gap-2">
              {data.tools.map((toolId: any, index: number) => (
                <ToolBlock
                  key={index}
                  toolId={toolId}
                  className="w-full"
                  selected={true}
                  onDelete={() => onDeleteTool(toolId)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full">
              <span>No tools selected</span>
              <ToolPicker onAddTool={onAddTool} />
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
