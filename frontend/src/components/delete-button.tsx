import clsx from 'clsx';
import React, { useState } from 'react';
import { Icons } from '@/components/icons';

export const DeleteButton = ({
  onDelete: _onDelete,
  className,
  tooltip,
  place,
}: {
  onDelete: () => Promise<void>;
  className?: string;
  tooltip?: string;
  place?: string;
}) => {
  const [deleting, setDeleting] = useState(false);
  const onDelete = async () => {
    setDeleting(true);
    await _onDelete();
    setDeleting(false);
  };
  return (
    <div
      onClick={() => onDelete()}
      className={clsx(
        'cursor-pointer btn btn-sm btn-ghost btn-square text-red-500',
        className
      )}
      data-tooltip-id="default-tooltip"
      data-tooltip-content={tooltip}
      data-tooltip-place={place ?? 'bottom'}
    >
      {deleting ? <div className="loading loading-xs" /> : <Icons.trash />}
    </div>
  );
};
