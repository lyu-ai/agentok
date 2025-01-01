import { stripMatch } from '@/lib/re';
import { StatusMessage } from '@/lib/chat';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useChat, useUser } from '@/hooks';
import { useToast } from '@/hooks/use-toast';
import { PopupDialog } from '@/components/popup-dialog';
import { useState } from 'react';
import { Message } from '@/types/chat';

interface MessageBubbleProps {
  chat: any;
  message: Message;
  onSend: (content: string) => void;
  onShowMessageData: (data: string) => void;
}

const MessageBubble = ({
  chat,
  message,
  onSend,
  onShowMessageData,
}: MessageBubbleProps) => {
  const t = useTranslations('component.ChatPane');
  const { chatSource } = useChat(chat.id);
  const { user } = useUser();
  const { toast } = useToast();
  const userNodeName =
    chatSource?.flow?.nodes?.find(
      (node: any) =>
        node.data.class === 'UserProxyAgent' ||
        node.data.class === 'RetrieveUserProxyAgent' ||
        node.data.name.includes('User')
    )?.data?.name ?? '';
  let waitForHumanInput = false;

  // End of thinking
  if (message.content.startsWith(StatusMessage.completed)) {
    const { found, text } = stripMatch(
      message.content,
      StatusMessage.completed
    );
    const success = found && text.startsWith('DONE');
    const resultClass = success ? 'text-green-500' : 'text-red-500/50';

    return (
      <div
        className="divider my-2 text-sm"
        data-tooltip-id="chat-tooltip"
        data-tooltip-content={text}
        data-tooltip-place="top"
      >
        <div
          className={`flex items-center gap-1 cursor-pointer ${resultClass}`}
        >
          {success ? (
            <Icons.check className="w-4 h-4" />
          ) : (
            <Icons.alert className="w-4 h-4" />
          )}
          <span>{t('thinking-end')}</span>
        </div>
      </div>
    );
  } else if (message.content.startsWith(StatusMessage.running)) {
    return (
      <div
        className="divider my-2 text-sm text-base-content/30"
        data-tooltip-id="chat-tooltip"
        data-tooltip-content={t('thinking-begin')}
        data-tooltip-place="top"
      >
        <div className="flex items-center gap-1 cursor-pointer">
          <Icons.robot className="w-4 h-4" />
          <span>{t('thinking-begin')}</span>
        </div>
      </div>
    );
  } else if (message.content.startsWith(StatusMessage.receivedHumanInput)) {
    message.content = t('received-human-input');
  } else if (message.content.startsWith(StatusMessage.waitForHumanInput)) {
    const { text } = stripMatch(
      message.content,
      StatusMessage.waitForHumanInput
    );
    message.content = text ?? t('wait-for-human-input');
    waitForHumanInput = true;
  }

  const messageClass = waitForHumanInput
    ? 'bg-yellow-600/20 text-yellow-600'
    : message.role === 'assistant'
      ? 'bg-base-content/20 text-base-content'
      : 'bg-primary/80 text-white';

  let avatarIcon = <Icons.robot className="w-5 h-5" />;
  if (message.role === 'user') {
    avatarIcon = user?.user_metadata.avatar_url ? (
      <img
        alt="avatar"
        src={user.user_metadata.avatar_url}
        className="w-full h-full object-cover rounded-full p-0.5"
      />
    ) : (
      <Icons.userVoiceLine className="w-5 h-5" />
    );
  } else if (message.sender === userNodeName) {
    avatarIcon = <Icons.userVoiceFill className="w-5 h-5" />;
  }

  let messageHeader = null;
  if (waitForHumanInput) {
    messageHeader = (
      <div className="flex items-center gap-2">{t('wait-for-human-input')}</div>
    );
  } else if (message.sender) {
    messageHeader = (
      <div className="chat-header w-full flex items-end gap-2 text-sm p-1 text-base-content/80">
        <div className="flex items-center gap-1">
          {message.sender}
          {message.receiver && (
            <>
              <Icons.voiceprintLine className="w-4 h-4 inline-block mx-1" />
              <span className="">{message.receiver}</span>
            </>
          )}
        </div>
        <div className="text-base-content/20 text-xs">
          {new Date(message.created_at).toLocaleString()}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onShowMessageData(message.content)}
        >
          <Icons.codeBlock className="w-4 h-4 text-gray-200/20 hover:text-gray-200/50" />
        </Button>
      </div>
    );
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t('copied'),
        description: t('message-copied'),
      });
    } catch (err) {
      toast({
        title: t('error'),
        description: t('copy-failed'),
        variant: 'destructive',
      });
    }
  };

  return (
    <div className={`chat gap-x-1 chat-start`}>
      <div className="chat-image text-base-content/50">
        <div
          className={`w-8 h-8 rounded-full text-sm ${messageClass} flex items-center justify-center`}
        >
          {avatarIcon}
        </div>
      </div>
      {messageHeader}
      <div
        className={`relative group chat-bubble rounded-md p-2 ${messageClass} break-word word-wrap overflow-x-hidden`}
        style={{ maxWidth: '100%' }}
      >
        {message.content ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <span className="text-lime-600">Empty Message</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 absolute right-1 bottom-1"
          onClick={() => copyToClipboard(message.content)}
        >
          <Icons.copy className="w-4 h-4" />
        </Button>
        {message.role === 'user' && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 absolute right-7 bottom-1"
            onClick={() => onSend(message.content)}
          >
            <Icons.refresh className="w-4 h-4 text-gray-200/20 hover:text-gray-200" />
          </Button>
        )}
      </div>
    </div>
  );
};

interface MessageListProps {
  chat: any;
  messages: Message[];
  onSend: (content: string) => void;
}

export const MessageList = ({ chat, messages, onSend }: MessageListProps) => {
  const t = useTranslations('component.ChatPane');
  const { toast } = useToast();
  const [messageData, setMessageData] = useState('');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t('copied'),
        description: t('message-copied'),
      });
    } catch (err) {
      toast({
        title: t('error'),
        description: t('copy-failed'),
        variant: 'destructive',
      });
    }
  };

  if (!messages.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <Icons.inbox className="w-12 h-12" />
          <p>{t('no-messages')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id || index}
          chat={chat}
          message={message}
          onSend={onSend}
          onShowMessageData={(data: string) => setMessageData(data)}
        />
      ))}
      <PopupDialog
        title="Raw Message Data"
        show={messageData !== ''}
        onClose={() => setMessageData('')}
        className="w-full max-w-3xl"
        classNameBody="max-h-screen overflow-y-auto"
      >
        <div className="p-4 text-sm text-base-content/50">
          <pre className="whitespace-pre-wrap">
            <code>{messageData}</code>
          </pre>
        </div>
      </PopupDialog>
    </>
  );
};
