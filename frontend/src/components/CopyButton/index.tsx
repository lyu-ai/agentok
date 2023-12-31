import clsx from 'clsx';
import React, { useState } from 'react';
import { GoCheck, GoCopy } from 'react-icons/go';
import { PlacesType } from 'react-tooltip';

const CopyButton = ({
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
  place?: PlacesType;
}) => {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const CopyIcon = copied ? GoCheck : GoCopy;
  return (
    <div
      onClick={() => onCopy()}
      className={clsx(
        className,
        'cursor-pointer',
        !minimal && 'btn btn-sm btn-ghost btn-square'
      )}
      data-tooltip-id="default-tooltip"
      data-tooltip-content={tooltip}
      data-tooltip-place={place ?? 'bottom'}
    >
      <CopyIcon className="w-4 h-4" />
    </div>
  );
};

export default CopyButton;
