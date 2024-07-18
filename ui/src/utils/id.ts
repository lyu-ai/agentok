export const genId = (): number => {
  const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp (seconds)
  const random = Math.floor(Math.random() * 100000); // 5-digit random number
  return timestamp * 100000 + random;
};
