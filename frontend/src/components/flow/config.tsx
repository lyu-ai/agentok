import { AssistantConfig } from './config/assistant';
import { UserConfig } from './config/user';
import { GroupChatConfig } from './config/group-chat';
import { ConversableAgentConfig } from './config/conversable-agent';
import { ConverseConfig } from './config/converse-config';
import { Icons } from '../icons';
import { useReactFlow } from '@xyflow/react';

interface FlowConfigProps {
    nodeId?: string;
    edgeId?: string;
}

export const FlowConfig = ({ nodeId, edgeId }: FlowConfigProps) => {
    const { getEdge, getNode } = useReactFlow();
    // Handle edge configuration
    if (edgeId) {
        const edge = getEdge(edgeId);
        if (!edge) {
            return <div className="flex flex-col justify-center items-center h-full text-muted-foreground gap-2">
                <Icons.node className="w-10 h-10" />
                <span className="text-sm font-bold">Edge not found</span>
            </div>;
        }
        return <ConverseConfig edgeId={edgeId} data={edge.data} />;
    }

    // Handle node configuration
    if (!nodeId) {
        return <div className="flex flex-col justify-center items-center h-full text-muted-foreground gap-2">
            <Icons.node className="w-10 h-10" />
            <span className="text-sm font-bold">Select a node or edge to configure</span>
        </div>;
    }

    const node = getNode(nodeId);
    if (!node) {
        return <div className="flex flex-col justify-center items-center h-full text-muted-foreground gap-2">
            <Icons.node className="w-10 h-10" />
            <span className="text-sm font-bold">Node not found</span>
        </div>;
    }

    // Extract node type from nodeId (format: node-{type}-{uuid})
    const type = nodeId.split('-')[1];

    switch (type) {
        case 'assistant':
            return <AssistantConfig nodeId={nodeId} data={node.data} />;
        case 'user':
            return <UserConfig nodeId={nodeId} data={node.data} />;
        case 'groupchat':
            return <GroupChatConfig nodeId={nodeId} data={node.data} />;
        case 'conversable':
            return <ConversableAgentConfig nodeId={nodeId} data={node.data} />;
        default:
            return <div className="flex flex-col justify-center items-center h-full text-muted-foreground gap-2">
                <Icons.node className="w-10 h-10" />
                <span className="text-sm font-bold">No configuration available for this node type</span>
            </div>;
    }
};