import { useCallback, useRef } from 'preact/hooks'
import type { ChatMessage } from '../types'

const TYPING_APPEAR_DELAY_MS = 220
const TYPING_DURATION_MS = 1200

function createId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useMessageStream(
  setMessages: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void,
) {
  const appearRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const replyRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (appearRef.current) {
      clearTimeout(appearRef.current)
      appearRef.current = null
    }
    if (replyRef.current) {
      clearTimeout(replyRef.current)
      replyRef.current = null
    }
  }, [])

  const sendMessage = useCallback(
    (userText: string, botResponse: string) => {
      clearTimers()

      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        content: userText,
      }

      const botId = createId()
      const typingMessage: ChatMessage = {
        id: botId,
        role: 'bot',
        content: '',
        isTyping: true,
      }

      setMessages((prev) => [...prev, userMessage])

      appearRef.current = setTimeout(() => {
        setMessages((prev) => [...prev, typingMessage])
      }, TYPING_APPEAR_DELAY_MS)

      replyRef.current = setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId
              ? { ...msg, content: botResponse, isTyping: false }
              : msg,
          ),
        )
      }, TYPING_APPEAR_DELAY_MS + TYPING_DURATION_MS)
    },
    [clearTimers, setMessages],
  )

  return { sendMessage, clearTimers }
}
