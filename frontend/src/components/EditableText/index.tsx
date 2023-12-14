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

  const onApplyChanges = () => {
    console.log('apply changes', inputValue);
    _onChange && _onChange(inputValue);
    setIsEditing(false);
    onModeChange && onModeChange(false);
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
            'nodrag input input-sm input-bordered bg-transparent rounded'
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
