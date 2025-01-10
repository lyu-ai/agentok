import { customAlphabet } from "nanoid";

export const genId = (): string => {
  // Create custom nanoid without hyphens
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
  return nanoid(6);
};

export const genNumberId = (): number => {
  const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp (seconds)
  const random = Math.floor(Math.random() * 100000); // 5-digit random number
  return timestamp * 100000 + random;
};
