import { useCallback, useRef } from 'preact/hooks'
import type { ChatMessage } from '../types'

const TYPING_DELAY_MS = 800
const WORD_INTERVAL_MS = 100

function createId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useMessageStream(
  setMessages: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void,
) {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
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
        content: '...',
        isTyping: true,
      }

      setMessages((prev) => [...prev, userMessage, typingMessage])

      timeoutRef.current = setTimeout(() => {
        const words = botResponse.split(' ')
        let index = 0

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botId
              ? { ...msg, content: '', isTyping: false, isStreaming: true }
              : msg,
          ),
        )

        timerRef.current = setInterval(() => {
          index += 1
          const partial = words.slice(0, index).join(' ')

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botId ? { ...msg, content: partial } : msg,
            ),
          )

          if (index >= words.length) {
            clearTimers()
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === botId ? { ...msg, isStreaming: false } : msg,
              ),
            )
          }
        }, WORD_INTERVAL_MS)
      }, TYPING_DELAY_MS)
    },
    [clearTimers, setMessages],
  )

  return { sendMessage, clearTimers }
}
