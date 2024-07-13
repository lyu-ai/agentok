import { NodeProps } from 'reactflow';
import { useTranslations } from 'next-intl';
import GroupChatConfig from '../config/GroupChat';
import GenericNode from './GenericNode';

const NestedChat = ({ id, data, ...props }: NodeProps) => {
  const t = useTranslations('node.NestedChat');
  return (
    <GenericNode
      id={id}
      data={data}
      {...props}
      nodeClass="group"
      ports={[
        { type: 'input', name: '' },
        { type: 'output', name: '' },
      ]}
      ConfigDialog={GroupChatConfig}
      style={{ width: 200, height: 200 }}
    >
      <div className="text-base-content/80">{t('nested-chat-hint')}</div>
    </GenericNode>
  );
};

export default NestedChat;
