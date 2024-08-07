import ConversableAgentConfig from "./ConversableAgent";

const AssistantConfig = ({ nodeId, data, className, ...props }: any) => {
  return (
    <ConversableAgentConfig
      nodeId={nodeId}
      data={data}
      className={className}
      toolScene={"llm"}
      {...props}
    />
  );
};

export default AssistantConfig;
