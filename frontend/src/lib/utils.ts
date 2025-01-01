import { env } from '@/env.mjs';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

// Utility function to get supported MIME type
export const getSupportedMimeType = (): string | null => {
  const possibleTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
    'audio/wav',
    'audio/mp4',
    'audio/mpeg',
  ];

  for (const type of possibleTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return null;
};

export const normalizePath = (path: string) =>
  path.replace(/\/+$/, '').toLowerCase();

export const arePathsEqual = (path1: string, path2: string) =>
  normalizePath(path1) === normalizePath(path2);

// Utility function to format an ID string, such as user_name to User Name
export const formatIdString = (input: string | undefined): string => {
  if (typeof input !== 'string') return '';

  return input
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Utility for formatting the timing of logs
 */
export const formatTime = (timestamp: string, startTime: string) => {
  const t0 = new Date(startTime).valueOf();
  const t1 = new Date(timestamp).valueOf();
  const delta = t1 - t0;
  const hs = Math.floor(delta / 10) % 100;
  const s = Math.floor(delta / 1000) % 60;
  const m = Math.floor(delta / 60_000) % 60;
  const pad = (n: number) => {
    let s = n + '';
    while (s.length < 2) {
      s = '0' + s;
    }
    return s;
  };
  return `${pad(m)}:${pad(s)}.${pad(hs)}`;
};

export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}
