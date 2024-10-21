export async function getToken(
  uid: string,
  channelName: string,
): Promise<{ token: string; uid: string; appId: string }> {
  const isProduction = import.meta.env.PROD;
  const endpoint = isProduction
    ? '/token/'
    : import.meta.env.VITE_TOKEN_ENDPOINT || '/token/';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        channelName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch token: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching Agora token:', error);
    return { token: '', appId: '', uid: '' };
  }
}
