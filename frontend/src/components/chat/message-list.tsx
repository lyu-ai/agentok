'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { stripMatch } from '@/lib/re';
import { StatusMessage } from '@/lib/chat';
import { Message } from '@/types/chat';
import { useChat, useUser } from '@/hooks';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CopyButton } from '../copy-button';
import { Card } from '../ui/card';

interface MessageBubbleProps {
  chat: any;
  message: Message;
  onSend: (content: string) => void;
}

const MessageBubble = ({ chat, message, onSend }: MessageBubbleProps) => {
  const { chatSource } = useChat(chat.id);
  const { user } = useUser();
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
      <div className={`flex items-center gap-1 cursor-pointer ${resultClass}`}>
        {success ? (
          <Icons.check className="w-4 h-4" />
        ) : (
          <Icons.alert className="w-4 h-4" />
        )}
        <span>Thinking completed</span>
      </div>
    );
  } else if (message.content.startsWith(StatusMessage.running)) {
    return (
      <div className="flex items-center gap-1 cursor-pointer">
        <Icons.node className="w-4 h-4" />
        <span>I am thinking...</span>
      </div>
    );
  } else if (message.content.startsWith(StatusMessage.receivedHumanInput)) {
    message.content = 'Human input received';
  } else if (message.content.startsWith(StatusMessage.waitForHumanInput)) {
    const { text } = stripMatch(
      message.content,
      StatusMessage.waitForHumanInput
    );
    message.content = text ?? 'Waiting for human input...';
    waitForHumanInput = true;
  }

  const messageClass = waitForHumanInput
    ? 'bg-yellow-600/20 text-yellow-600'
    : message.role === 'assistant'
      ? 'bg-primary text-primary-foreground'
      : 'bg-muted/20 text-muted-foreground';

  let avatarIcon = <Icons.node className="w-5 h-5" />;
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
      <div className="flex items-center gap-2">Waiting for human input...</div>
    );
  } else if (message.sender) {
    messageHeader = (
      <div className="chat-header flex items-end gap-2 text-xs">
        <div className="flex items-center gap-1">
          {message.sender}
          {message.receiver && (
            <>
              <Icons.voiceprintLine className="w-4 h-4 inline-block mx-1" />
              <span className="">{message.receiver}</span>
            </>
          )}
        </div>
        <div className="text-muted-foreground/20 text-xs">
          {new Date(message.created_at).toLocaleString()}
        </div>
      </div>
    );
  }

  return (
    <Card className={`${messageClass} p-3 max-w-3xl w-full mx-auto`}>
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full text-sm flex items-center justify-center`}
        >
          {avatarIcon}
        </div>
        <div className="flex flex-1">{messageHeader}</div>
        <Dialog>
          <DialogTrigger>
            <Icons.code className="w-4 h-4" />
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Raw Message Data</DialogTitle>
            <pre className="whitespace-pre-wrap">
              <code>{message.content}</code>
            </pre>
          </DialogContent>
        </Dialog>
        <CopyButton content={message.content} />
      </div>
      <div
        className={`relative group rounded-md p-2 text-sm break-word word-wrap overflow-x-hidden`}
      >
        {message.content ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <span className="text-lime-600">Empty Message</span>
        )}
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
    </Card>
  );
};

interface MessageListProps {
  chat: any;
  messages: Message[];
  onSend: (content: string) => void;
}

export const MessageList = ({ chat, messages, onSend }: MessageListProps) => {
  if (!messages.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground/20">
        <div className="flex flex-col items-center gap-4">
          <Icons.node className="w-12 h-12" />
          <p>No messages yet</p>
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
        />
      ))}
    </>
  );
};
