import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';
import { GoCheck, GoCopy } from 'react-icons/go';
import { PlacesType } from 'react-tooltip';

const CopyButton = ({
  content,
  minimal,
  className,
  place,
}: {
  content: string;
  minimal?: boolean;
  className?: string;
  place?: PlacesType;
}) => {
  const [copied, setCopied] = useState(false);
  const t = useTranslations('component.CopyButton')
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
      className={clsx(className, !minimal && 'btn btn-sm btn-ghost btn-square')}
      data-tooltip-id="default-tooltip"
      data-tooltip-content={copied ? t('copied'): t('copy')}
      data-tooltip-place={place ?? 'bottom'}
    >
      <CopyIcon className="w-4 h-4" />
    </div>
  );
};

export default CopyButton;
