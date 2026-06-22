function getStorageKey(apiBaseUrl: string): string {
  return `raya-widget-session-${apiBaseUrl.replace(/[^a-z0-9]+/gi, '-')}`
}

export interface StoredSession {
  messages: import('../types').ChatMessage[]
  view: 'faq' | 'chat'
}

function sanitizeMessages(messages: import('../types').ChatMessage[]) {
  return messages.map(({ id, role, content }) => ({ id, role, content }))
}

export function loadSession(apiBaseUrl: string): StoredSession | null {
  try {
    const raw = localStorage.getItem(getStorageKey(apiBaseUrl))
    if (!raw) return null

    const data = JSON.parse(raw) as StoredSession
    const messages = sanitizeMessages(data.messages ?? [])

    if (messages.length === 0) return null

    return {
      messages,
      view: messages.length > 0 ? 'chat' : 'faq',
    }
  } catch {
    return null
  }
}

export function saveSession(apiBaseUrl: string, session: StoredSession): void {
  try {
    localStorage.setItem(
      getStorageKey(apiBaseUrl),
      JSON.stringify({
        view: session.view,
        messages: sanitizeMessages(session.messages),
      }),
    )
  } catch {
    // localStorage full or blocked
  }
}

export function clearSession(apiBaseUrl: string): void {
  try {
    localStorage.removeItem(getStorageKey(apiBaseUrl))
  } catch {
    // ignore
  }
}
