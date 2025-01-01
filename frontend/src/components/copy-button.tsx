import clsx from 'clsx';
import React, { useState } from 'react';
import { Icons } from '@/components/icons';

export const CopyButton = ({
  content,
  minimal,
  className,
  tooltip,
  place,
}: {
  content: string;
  minimal?: boolean;
  className?: string;
  tooltip?: string;
  place?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const CopyIcon = copied ? Icons.check : Icons.copy;
  return (
    <div
      onClick={() => onCopy()}
      className={clsx(
        className,
        'cursor-pointer',
        !minimal && 'btn btn-sm btn-ghost btn-circle'
      )}
      data-tooltip-id="default-tooltip"
      data-tooltip-content={tooltip ?? 'Copy'}
      data-tooltip-place={place ?? 'bottom'}
    >
      <CopyIcon className="w-4 h-4" />
    </div>
  );
};
