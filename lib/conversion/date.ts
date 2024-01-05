export function localeTimestampToDbDate(
  timestamp?: number
): string | undefined {
  if (!timestamp) return undefined;
  return new Date(timestamp).toISOString();
}
