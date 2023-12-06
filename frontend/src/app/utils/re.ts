export function stripMatch(str: string, prefix: string) {
  const regex = new RegExp(`^${prefix}\\s*(.*)`);
  const match = str.match(regex);
  return match
    ? { found: true, text: match[1].trim() }
    : { found: false, text: str };
}
