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
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Markdown } from '@/components/markdown';
import { ScrollArea } from '../ui/scroll-area';

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
    const resultClass = success
      ? 'bg-green-500/20 text-green-500'
      : 'bg-red-500/20 text-red-500';

    return (
      <Card
        className={`flex items-center gap-2 shadow-sm px-3 py-1 rounded-md ${resultClass}`}
      >
        {success ? (
          <Icons.checkCircle className="w-4 h-4" />
        ) : (
          <Icons.alert className="w-4 h-4" />
        )}
        <span className="text-sm font-semibold">
          Collaboration completed with {success ? 'success' : 'failure'}.
        </span>
      </Card>
    );
  } else if (message.content.startsWith(StatusMessage.running)) {
    return (
      <Card className="flex items-center gap-2 shadow-sm px-3 py-1 bg-blue-500/20 text-blue-500 rounded-md">
        <Icons.node className="w-4 h-4" />
        <span className="text-sm font-semibold">
          Collaboration started... Please wait for the conclusion.
        </span>
      </Card>
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

  let avatarIcon = <Icons.node className="w-4 h-4" />;
  if (message.role === 'user') {
    avatarIcon = (
      <Avatar>
        <AvatarImage src={user?.user_metadata.avatar_url} />
        <AvatarFallback>
          <Icons.userVoiceLine className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
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
    <Card className={`${messageClass} p-1 w-full mx-auto shadow-sm max-w-4xl `}>
      <div className="flex items-center gap-2">
        <div
          className={`w-8 h-8 rounded-full text-sm flex items-center justify-center`}
        >
          {avatarIcon}
        </div>
        <div className="flex flex-1">{messageHeader}</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="w-7 h-7">
              <Icons.code className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[calc(100vh-2rem)] overflow-hidden p-0 gap-0">
            <DialogTitle className="text-sm font-semibold px-2 py-3 border-b">
              Raw Message Content
            </DialogTitle>
            <ScrollArea className="max-h-[calc(100vh-var(--header-height))] text-sm bg-muted/20">
              <pre className="whitespace-pre-wrap p-2">
                <code>{message.content}</code>
              </pre>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <CopyButton content={message.content} />
      </div>
      <div
        className={`relative group rounded-md p-2 text-sm break-word word-wrap overflow-x-hidden`}
      >
        {message.content ? (
          <Markdown>{message.content}</Markdown>
        ) : (
          <span className="text-lime-600">...</span>
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
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50">
        <div className="flex flex-col items-center gap-4">
          <Icons.node className="w-10 h-10" />
          <p>Let&apos;s start chatting!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 w-full max-w-4xl mx-auto">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id || index}
          chat={chat}
          message={message}
          onSend={onSend}
        />
      ))}
    </div>
  );
};
