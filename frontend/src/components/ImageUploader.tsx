import React, { useState } from "react";
import supabase from "@/utils/supabase/client";
import { RiImageAddLine } from "react-icons/ri";

type ImageUploaderProps = {
  imageUrl: string;
  storagePath?: string;
  onUpdate?: (imageUrl: string) => void;
  className?: string;
};

const ImageUploader = ({
  imageUrl,
  storagePath,
  onUpdate,
  className,
}: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState(imageUrl);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${storagePath ?? "/images"}/${fileName}`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading file: ", error);
        setIsUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      setPreviewUrl(publicUrl);
      onUpdate && onUpdate(publicUrl);
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`image-uploader ${className} overflow-hidden border border-dashed border-base-content/20 rounded`}
    >
      <input
        type="file"
        onChange={handleUpload}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        {isUploading ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="loading loading-xs" />
          </div>
        ) : previewUrl ? (
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Uploaded"
              className="block max-w-full max-h-72"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-base-content opacity-0 hover:opacity-90 transition-opacity">
              <RiImageAddLine className="w-10 h-10 text-primary" />
            </div>
          </div>
        ) : (
          <div className="">
            <RiImageAddLine />
          </div>
        )}
      </label>
    </div>
  );
};

export default ImageUploader;
