import { customAlphabet } from "nanoid";

export const genId = (): string => {
  // Create custom nanoid without hyphens
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
  return nanoid(6);
};
