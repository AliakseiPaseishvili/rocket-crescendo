export function fillUrl({ url, params }: { url: string; params: Record<string, string> }): string {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.replace(`:${key}`, value),
    url,
  );
}
