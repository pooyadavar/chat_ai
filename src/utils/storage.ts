import type { ChatMessage } from '../types'

export interface StoredSession {
  messages: ChatMessage[]
  view: 'faq' | 'chat'
}

function getStorageKey(apiKey: string | null): string {
  return `raya-widget-session${apiKey ? `-${apiKey}` : ''}`
}

function sanitizeMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.map(({ id, role, content }) => ({ id, role, content }))
}

export function loadSession(apiKey: string | null): StoredSession | null {
  try {
    const raw = localStorage.getItem(getStorageKey(apiKey))
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

export function saveSession(
  apiKey: string | null,
  session: StoredSession,
): void {
  try {
    localStorage.setItem(
      getStorageKey(apiKey),
      JSON.stringify({
        view: session.view,
        messages: sanitizeMessages(session.messages),
      }),
    )
  } catch {
    // localStorage full or blocked
  }
}

export function clearSession(apiKey: string | null): void {
  try {
    localStorage.removeItem(getStorageKey(apiKey))
  } catch {
    // ignore
  }
}
