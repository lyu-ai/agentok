export const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  if (!response.ok) {
    console.error(`Failed fetcher ${url}:`, response.statusText);
    throw new Error(`Error fetching data ${url}: ${response.statusText}`);
  }
  return response.json();
};
