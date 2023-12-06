import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa'; // You can get this from `react-icons` package
import { FaCheck, FaX } from 'react-icons/fa6';

const EditableText = ({
  text,
  onChange: _onChange,
  onModeChange,
  editing,
  showButtons,
  className,
  alignRight,
}: any) => {
  const [isEditing, setIsEditing] = useState(editing);
  const [inputValue, setInputValue] = useState(text);

  useEffect(() => setIsEditing(editing), [editing]);
  useEffect(() => setInputValue(text), [text]);
  useEffect(() => onModeChange && onModeChange(isEditing), [isEditing]);

  const onKeyDown = (e: any) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      if (e.key === 'Enter') {
        _onChange && _onChange(inputValue);
      }
      setIsEditing(false);
    }
  };

  const onApplyChanges = () => {
    console.log('apply changes', inputValue);
    _onChange && _onChange(inputValue);
    setIsEditing(false);
  };

  return (
    <div className="relative flex items-center gap-1">
      {isEditing ? (
        <input
          type="text"
          value={inputValue ?? ''}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          className={clsx(
            className,
            { 'text-right': alignRight },
            'nodrag input input-xs input-bordered bg-transparent rounded p-1'
          )}
        />
      ) : (
        <div
          className={clsx(
            className,
            { 'justify-end': alignRight },
            'flex items-center gap-1 px-2 py-1'
          )}
        >
          <span>{text}</span>
        </div>
      )}
      {showButtons && isEditing && (
        <div className="flex items-center gap-1">
          <button
            className="btn btn-square btn-xs btn-ghost text-red-800 hover:text-red-700"
            onClick={() => setIsEditing(false)}
          >
            <FaX className="w-4 h-4" />
          </button>
          <button
            className="btn btn-square btn-xs btn-ghost text-green-800 hover:text-green-700"
            onClick={onApplyChanges}
          >
            <FaCheck className="w-4 h-4" />
          </button>
        </div>
      )}
      {showButtons && !isEditing && (
        <button
          className="btn btn-square btn-xs btn-ghost"
          onClick={() => setIsEditing(true)}
        >
          <FaEdit className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default EditableText;
