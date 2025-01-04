'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onImageUpload: (file: File) => Promise<void>;
  onImageRemove?: () => void;
  imageUrl?: string;
  className?: string;
}

export function ImageUploader({
  onImageUpload,
  onImageRemove,
  imageUrl,
  className,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        title: 'Invalid file type',
        description: 'Please upload an image file',
      });
      return;
    }

    try {
      await onImageUpload(file);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Failed to upload image',
      });
    }
  };

  return (
    <div className={className}>
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-4 text-center',
          isDragging && 'border-primary bg-primary/5',
          'hover:border-primary/50 transition-colors'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {imageUrl ? (
          <div className="relative">
            <Image
              src={imageUrl}
              alt="Uploaded image"
              className="max-w-full h-auto rounded"
              width={300}
              height={300}
            />
            {onImageRemove && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={onImageRemove}
              >
                <Icons.close className="h-4 w-4" />
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Icons.upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <span className="font-semibold text-primary hover:underline">
                  Click to upload
                </span>{' '}
                or drag and drop
              </Label>
              <Input
                id="image-upload"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                accept="image/*"
              />
              <p className="text-sm text-muted-foreground">
                SVG, PNG, JPG or GIF (max. 800x400px)
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
