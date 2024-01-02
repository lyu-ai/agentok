import { stripMatch } from '@/utils/re';
import { StatusMessage } from '@/utils/chat';
import { RiRobot2Line, RiRobot2Fill } from 'react-icons/ri';
import {
  GoCheckCircle,
  GoAlert,
  GoPersonFill,
  GoMegaphone,
} from 'react-icons/go';
import { IoReload } from 'react-icons/io5';
import Markdown from '@/components/Markdown';
import { useTranslations } from 'next-intl';
import { getAvatarUrl } from '@/utils/pocketbase/client';
import pb from '@/utils/pocketbase/client';
import { useChat } from '@/hooks';

const MessageBlock = ({ chatId, message, onSend }: any) => {
  const t = useTranslations('component.Chat');
  const { chatSource } = useChat(chatId);
  const userNodeName =
    chatSource?.flow?.nodes?.find(
      (node: any) =>
        node.data.class === 'UserProxyAgent' ||
        node.data.class === 'RetrieveUserProxyAgent'
    )?.data?.name ?? '';
  let waitForHumanInput = false;

  // End of thinking
  if (message.content.startsWith(StatusMessage.completed)) {
    const { found, text } = stripMatch(
      message.content,
      StatusMessage.completed
    );
    const success = found && text.startsWith('DONE');
    const ResultIcon = success ? GoCheckCircle : GoAlert;
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
          <ResultIcon className="w-4 h-4" />
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
          <RiRobot2Line className="w-4 h-4" />
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
    : message.type === 'assistant'
    ? 'bg-base-content/20 text-base-content'
    : 'bg-primary/80 text-white';

  let avatarIcon = <RiRobot2Fill className="w-5 h-5" />;
  if (message.type === 'user') {
    avatarIcon = pb.authStore.model?.avatar ? (
      <img
        alt="avatar"
        src={getAvatarUrl(pb.authStore.model as any)}
        className="w-full h-full object-cover rounded-full"
      />
    ) : (
      <GoPersonFill className="w-5 h-5" />
    );
  } else if (message.sender === userNodeName) {
    avatarIcon = <GoPersonFill className="w-5 h-5" />;
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
              <GoMegaphone className="w-3 h-3 inline-block mx-1" />
              <span className=" text-base-content/50">{message.receiver}</span>
            </>
          )}
        </div>
        <div className="text-base-content/20 text-xs">
          {new Date(message.created).toLocaleString()}
        </div>
      </div>
    );
  }

  return (
    <div className={`chat gap-x-1 chat-start`}>
      <div className="chat-image text-base-content/50">
        <div
          className={`w-8 h-8 rounded-full ${messageClass} flex items-center justify-center`}
        >
          {avatarIcon}
        </div>
      </div>
      {messageHeader}
      <div
        className={`relative group chat-bubble rounded-md p-2 ${messageClass} break-word word-wrap`}
        style={{ maxWidth: '100%' }}
      >
        {message.content ? (
          <Markdown>{message.content}</Markdown>
        ) : (
          <span className="text-lime-600">Empty Message</span>
        )}
        {message.type === 'user' && (
          <div className="hidden group-hover:block absolute right-1 bottom-1">
            <button
              className="btn btn-xs btn-circle"
              data-tooltip-content={t('resend')}
              data-tooltip-id="chat-tooltip"
              onClick={() => onSend(message.content)}
            >
              <IoReload className="w-4 h-4 text-gray-200/20 group-hover:text-gray-200" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MessageList = ({ chatId, messages, onSend }: any) => {
  const t = useTranslations('component.Chat');
  return (
    <>
      {messages.length === 0 && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center gap-2 text-sm text-base-content/20">
            <RiRobot2Line className="w-12 h-12" />
            {t('message-empty')}
          </div>
        </div>
      )}
      {messages.map((message: any) => (
        <MessageBlock
          key={message.id}
          chatId={chatId}
          message={message}
          onSend={onSend}
        />
      ))}
    </>
  );
};

export default MessageList;
