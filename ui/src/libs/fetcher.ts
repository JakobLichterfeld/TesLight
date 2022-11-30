export const fetcher = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<string> => {
  const res = await fetch(input, init);
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.text();
};
