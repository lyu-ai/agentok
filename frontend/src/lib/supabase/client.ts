import { createBrowserClient } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import { genId } from '../id';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const supabase = createClient();

export default supabase;

// Utility functions for generating file URLs
export const getRecordFileUrl =
  (supabase: SupabaseClient, fileFieldName: string) =>
  (record: { [key: string]: any }) =>
    supabase.storage.from('files').getPublicUrl(record[fileFieldName]).data
      .publicUrl;

export const getAssetFileUrl = (supabase: SupabaseClient) =>
  getRecordFileUrl(supabase, 'file');

export const getAvatarUrl = async () => {
  const resp = await supabase.auth.getUser();
  const user = resp.data.user;
  if (!user) return null;
  return user.user_metadata?.avatar_url;
};

export const getIconUrl = getRecordFileUrl(supabase, 'icon');

export interface Attachment {
  url: string;
  contentType: string;
  name: string;
}

export async function uploadFile(
  file: File,
  bucket = 'attachments'
): Promise<Attachment> {
  const supabase = createClient();

  // Validate file size (10MB limit)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error(
      `File size exceeds 10MB limit. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
    );
  }

  const ext = file.name.split('.').pop()?.toLowerCase();
  // Validate file extension
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];
  if (!ext || !allowedExtensions.includes(ext)) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`
    );
  }

  const path = `${genId()}.${ext}`;

  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return {
      url: publicUrl,
      contentType: file.type,
      name: file.name,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to upload file'
    );
  }
}

export async function deleteFile(path: string, bucket = 'attachments') {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw error;
  }
}
