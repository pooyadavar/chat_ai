export async function fetchChatReply(
  apiBaseUrl: string,
  message: string,
): Promise<string> {
  const base = apiBaseUrl.replace(/\/$/, '')
  const response = await fetch(`${base}/v1/widget/chat`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error(`Chat API failed: ${response.status}`)
  }

  const data = (await response.json()) as { reply?: string }
  if (!data.reply) {
    throw new Error('Chat API returned empty reply')
  }

  return data.reply
}
