import clsx from 'clsx';
import React, { useState } from 'react';
import { GoCheck, GoCopy } from 'react-icons/go';

const CopyButton = ({
  content,
  minimal,
  className,
}: {
  content: string;
  minimal?: boolean;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const ButtonIcon = copied ? GoCheck : GoCopy;
  return (
    <button
      onClick={onCopy}
      className={clsx(className, !minimal && 'btn btn-sm btn-ghost btn-square')}
      data-tooltip-id="default-tooltip"
      data-tooltip-content={copied ? '已拷贝' : '拷贝'}
    >
      <ButtonIcon className="w-4 h-4" />
    </button>
  );
};

export default CopyButton;
