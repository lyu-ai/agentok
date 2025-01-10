import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Icons } from '@/components/icons';

export const EditableText = ({
  text,
  onChange: _onChange,
  onModeChange,
  editing,
  showButtons,
  className,
  alignRight,
}: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setIsEditing(editing);
    setInputValue(text);
  }, [editing, text]);

  const onKeyDown = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      if (e.key === 'Enter') {
        _onChange && _onChange(inputValue);
      }
      setIsEditing(false);
      onModeChange && onModeChange(false);
    }
  };

  const onApplyChange = () => {
    _onChange && _onChange(inputValue);
    setIsEditing(false);
    onModeChange && onModeChange(false);
  };

  const onDiscardChange = () => {
    setIsEditing(false);
    setInputValue(text);
  };
  return (
    <div className="relative flex items-center gap-1">
      {isEditing ? (
        <input
          type="text"
          value={inputValue ?? ''}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          className={clsx(
            className,
            { 'text-right': alignRight },
            'nodrag nowheel input input-xs p-1 input-bordered bg-transparent rounded-sm'
          )}
        />
      ) : (
        <div
          className={clsx(
            className,
            { 'justify-end': alignRight },
            'flex items-center p-1'
          )}
        >
          {text}
        </div>
      )}
      {showButtons && isEditing && (
        <div className="flex items-center gap-1">
          <button
            className="btn btn-square btn-xs btn-ghost rounded"
            onClick={onApplyChange}
          >
            <Icons.check className="w-4 h-4" />
          </button>
          <button
            className="btn btn-square btn-xs btn-ghost rounded text-red-800 hover:text-red-700"
            onClick={onDiscardChange}
          >
            <Icons.close className="w-4 h-4" />
          </button>
        </div>
      )}
      {showButtons && !isEditing && (
        <button
          className="btn btn-square btn-xs btn-ghost rounded"
          onClick={() => setIsEditing(true)}
        >
          <Icons.edit className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
