import { useState } from 'react';
import clsx from 'clsx';
import ImagePanel from './ImagePanel';
import { useTranslations } from 'next-intl';
import { RiImageAddLine, RiSendPlane2Line, RiStopFill } from 'react-icons/ri';

const ChatInput = ({
  onSend: _onSend,
  onAbort,
  status,
  className,
  ...props
}: any) => {
  const [showImagePanel, setShowImagePanel] = useState(false);
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');
  const t = useTranslations('component.ChatInput');

  const onSend = async () => {
    setShowImagePanel(false);
    setMessage(''); // clear input only when sent successfully
    setImage(''); // clear image only when sent successfully
    if (_onSend) {
      await _onSend(image ? `${message} <img ${image}>` : message);
    }
  };
  const onKeyDown = (event: any) => {
    // event.nativeEvent.isComposing === true when the user is typing in a CJK IME.
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      onSend();
    }
  };
  const panelTransitionStyle =
    'transition-[max-height] duration-300 ease-in-out overflow-hidden';
  return (
    <div className={clsx(className, 'flex flex-col')} {...props}>
      <div
        className={clsx(
          'w-full h-48 border-base-content/20 rounded-t-md',
          panelTransitionStyle,
          {
            'max-h-0': !showImagePanel, // When image panel is hidden
            'max-h-48': showImagePanel, // When image panel is shown, adjust '48' accordingly
          }
        )}
      >
        <ImagePanel onSelectImage={setImage} />
      </div>
      <div className="flex flex-row w-full items-center gap-2">
        <button
          className="ml-1 text-primary/80 hover:text-primary w-8 h-8 flex-shrink-0"
          onClick={() => setShowImagePanel(!showImagePanel)}
        >
          {image ? (
            <img
              src={image}
              alt="image"
              className="object-cover aspect-w-1 aspect-h-1 w-8 h-8 rounded"
            />
          ) : (
            <RiImageAddLine className="w-6 h-6" />
          )}
        </button>
        <input
          className="w-full bg-transparent rounded-md"
          placeholder={t('enter-message')}
          value={message}
          autoFocus
          onKeyDown={onKeyDown}
          onChange={(e: any) => setMessage(e.target.value)}
          disabled={status === 'running'}
        />
        {status === 'running' || status === 'wait_for_human_input' ? (
          <button
            className="btn btn-sm bg-red-800 hover:bg-red-700 border border-red-700 hover:border-red-600"
            onClick={onAbort}
            data-tooltip-id="chat-tooltip"
            data-tooltip-content={t('abort')}
            data-tooltip-place="left"
          >
            <RiStopFill className="w-5 h-5" />
          </button>
        ) : (
          <button className="btn btn-sm btn-primary" onClick={onSend}>
            <RiSendPlane2Line className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
