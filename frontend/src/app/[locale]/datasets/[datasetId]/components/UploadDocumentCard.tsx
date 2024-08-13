import { useDocuments } from '@/hooks';
import React, { useRef, useState } from 'react';
import { useDrop } from 'react-dnd';
import { RiUpload2Line } from 'react-icons/ri';
import { toast } from 'react-toastify';

const UploadDocumentCard = ({ datasetId }: { datasetId: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { mutate } = useDocuments(datasetId);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/datasets/${datasetId}/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }
      mutate();

      const document = await response.json();
      console.log('Uploaded document:', document);
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error uploading document');
    } finally {
      setIsUploading(false);
    }
  };

  const isValidFileType = (file: File) => {
    const validExtensions = ['.md', '.txt', '.pdf', '.docx', '.doc']; // Add other valid extensions here
    const fileName = file.name.toLowerCase();
    return validExtensions.some((extension) => fileName.endsWith(extension));
  };

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'file',
    drop: (item: { files: File[] }, monitor) => {
      console.log('Dropped files:', item.files, monitor.getDropResult());
      if (monitor.didDrop()) {
        return;
      }
      item.files.forEach((file) => {
        if (isValidFileType(file)) {
          handleUpload(file);
        } else {
          toast.error(`Unsupported file type: ${file.type}`);
        }
      });
    },
    canDrop: (item: { files: File[] }) =>
      item.files.every((file) => isValidFileType(file)),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        if (isValidFileType(file)) {
          handleUpload(file);
        } else {
          toast.error(`Unsupported file type: ${file.type}`);
        }
      });
    }
    // Clear the input value to allow selecting the same file again
    event.target.value = '';
  };

  drop(ref);

  const isActive = canDrop && isOver;
  const backgroundColor = isActive
    ? 'bg-green-200'
    : canDrop
      ? 'bg-green-100'
      : 'bg-base-content/5';

  return (
    <div
      ref={ref}
      onClick={() => fileInputRef.current?.click()}
      className={`flex items-center justify-center w-full max-w-sm h-48 p-4 ${backgroundColor} hover:bg-base-content/10 rounded-md border-dashed border border-base-content/20 cursor-pointer`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        multiple
      />
      <div className="flex flex-col items-center gap-4">
        {isUploading ? (
          <div className="loading" />
        ) : (
          <RiUpload2Line className="w-8 h-8" />
        )}
        <div className="text-sm text-center">
          {isActive
            ? 'Drop the document here...'
            : 'Click or drag to upload new documents.'}
        </div>
      </div>
    </div>
  );
};

export default UploadDocumentCard;
