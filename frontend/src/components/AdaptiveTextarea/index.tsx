import { useEffect, useRef, useState } from 'react';

const AdaptiveTextarea = ({ placeholder, value, onChange, onEnter, className }: any) => {
  const [height, setHeight] = useState('16px');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resetTextareaHeight = (textarea: any) => {
    textarea.style.height = '16px'; /* Reset height to default */
    textarea.style.height = `${
      Math.min(
        textarea.scrollHeight,
        5 * 1.5 * 20,
      )
    }px`; /* Set height to fit content or max 5 lines */
    setHeight(textarea.style.height);
  };

  useEffect(() => {
    if (textareaRef.current) {
      resetTextareaHeight(textareaRef.current);
    }
  }, [value]); // Reset the height of the textarea when the value changes.

  const onKeyDown = (event: any) => {
    // event.nativeEvent.isComposing === true when the user is typing in a CJK IME.
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      onEnter();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      color="primary"
      autoFocus
      style={{ height: height }}
      className={`${className ? className : ''} resize-none bg-transparent p-1 text-base-content`}
      placeholder={placeholder}
      value={value}
      onInput={onChange}
      onKeyDown={onKeyDown}
    />
  );
};

export default AdaptiveTextarea;
