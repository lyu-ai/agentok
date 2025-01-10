import { ConversableAgentConfig } from './conversable-agent';

export const AssistantConfig = ({ nodeId, data, className, ...props }: any) => {
  return (
    <ConversableAgentConfig
      nodeId={nodeId}
      data={data}
      className={className}
      toolScene={'llm'}
      {...props}
    />
  );
};
