'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Icons } from '@/components/icons';
import { useSettings } from '@/hooks';
import Markdown from '@/components/markdown';

interface Message {
  id: string;
  content: string;
  role: string;
  name?: string;
  function_call?: any;
}

interface MessageListProps {
  messages: Message[];
  onMessageClick?: (message: Message) => void;
  onMessageDelete?: (message: Message) => void;
  onMessageEdit?: (message: Message) => void;
  className?: string;
}

export const MessageList = ({
  messages,
  onMessageClick,
  onMessageDelete,
  onMessageEdit,
  className,
}: MessageListProps) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (editingMessage && editTextareaRef.current) {
      editTextareaRef.current.focus();
      editTextareaRef.current.setSelectionRange(
        editTextareaRef.current.value.length,
        editTextareaRef.current.value.length
      );
    }
  }, [editingMessage]);

  const handleMessageClick = (message: Message) => {
    if (onMessageClick) {
      onMessageClick(message);
    }
    setSelectedMessage(message);
  };

  const handleMessageDelete = (message: Message) => {
    if (onMessageDelete) {
      onMessageDelete(message);
    }
  };

  const handleMessageEdit = (message: Message) => {
    setEditingMessage(message);
  };

  const handleEditSave = () => {
    if (editingMessage && onMessageEdit) {
      onMessageEdit(editingMessage);
    }
    setEditingMessage(null);
  };

  const handleEditCancel = () => {
    setEditingMessage(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (editingMessage) {
      setEditingMessage({
        ...editingMessage,
        content: e.target.value,
      });
    }
  };

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={clsx(
            'group relative flex flex-col gap-2 p-4 rounded-xl border',
            'bg-base-content/10 border-base-content/10',
            'hover:border-primary/40',
            {
              'border-primary': selectedMessage?.id === message.id,
            }
          )}
          onClick={() => handleMessageClick(message)}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Icons.robot className="w-4 h-4" />
              <span className="text-sm font-bold">{message.role}</span>
              {message.name && (
                <span className="text-sm text-base-content/60">
                  ({message.name})
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                className="btn btn-xs btn-ghost btn-square rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMessageEdit(message);
                }}
                data-tooltip-id="default-tooltip"
                data-tooltip-content="Edit message"
              >
                <Icons.edit className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="btn btn-xs btn-ghost btn-square rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMessageDelete(message);
                }}
                data-tooltip-id="default-tooltip"
                data-tooltip-content="Delete message"
              >
                <Icons.trash className="w-4 h-4" />
              </button>
            </div>
          </div>
          {editingMessage?.id === message.id ? (
            <div className="flex flex-col gap-2">
              <textarea
                ref={editTextareaRef}
                className="textarea textarea-bordered w-full min-h-[100px]"
                value={editingMessage.content}
                onChange={handleEditChange}
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={handleEditCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={handleEditSave}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <Markdown className="text-sm">{message.content}</Markdown>
          )}
          {message.function_call && (
            <div className="flex flex-col gap-2">
              <div className="text-sm font-bold">Function Call</div>
              <pre className="text-sm bg-base-content/5 p-2 rounded">
                {JSON.stringify(message.function_call, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
