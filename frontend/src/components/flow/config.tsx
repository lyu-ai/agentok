import { AssistantConfig } from './config/assistant';
import { UserConfig } from './config/user';
import { GroupChatConfig } from './config/group-chat';
import { ConversableAgentConfig } from './config/conversable-agent';

interface FlowConfigProps {
    nodeId?: string;
    data?: Record<string, any>;
}

export const FlowConfig = ({ nodeId, data }: FlowConfigProps) => {
    if (!nodeId || !data) {
        return <div className="p-4 text-sm text-muted-foreground">Select a node to configure</div>;
    }

    // Extract node type from nodeId (format: node-{type}-{uuid})
    const type = nodeId.split('-')[1];

    switch (type) {
        case 'assistant':
            return <AssistantConfig nodeId={nodeId} data={data} />;
        case 'user':
            return <UserConfig nodeId={nodeId} data={data} />;
        case 'groupchat':
            return <GroupChatConfig nodeId={nodeId} data={data} />;
        case 'conversable':
            return <ConversableAgentConfig nodeId={nodeId} data={data} />;
        default:
            return <div className="p-4 text-sm text-muted-foreground">No configuration available for this node type</div>;
    }
};
