import { useCallback, useRef } from 'preact/hooks'
import { fetchChatReply } from '../utils/chatApi'
import type { ChatMessage } from '../types'

const TYPING_APPEAR_DELAY_MS = 220
const MIN_TYPING_MS = 800

interface UseMessageStreamOptions {
  apiBaseUrl: string
  fallbackReply: string
}

function createId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function useMessageStream(
  setMessages: (updater: (prev: ChatMessage[]) => ChatMessage[]) => void,
  options: UseMessageStreamOptions,
) {
  const appearRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const replyRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const requestRef = useRef(0)

  const clearTimers = useCallback(() => {
    if (appearRef.current) {
      clearTimeout(appearRef.current)
      appearRef.current = null
    }
    if (replyRef.current) {
      clearTimeout(replyRef.current)
      replyRef.current = null
    }
    requestRef.current += 1
  }, [])

  const sendMessage = useCallback(
    (userText: string, localReply?: string) => {
      clearTimers()

      const requestId = requestRef.current
      const startedAt = Date.now()
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
        if (requestId !== requestRef.current) return

        setMessages((prev) => {
          if (prev.some((m) => m.id === botId)) return prev
          return [...prev, typingMessage]
        })
      }, TYPING_APPEAR_DELAY_MS)

      const resolveReply = async (): Promise<string> => {
        if (localReply) return localReply

        if (options.apiBaseUrl) {
          try {
            return await fetchChatReply(options.apiBaseUrl, userText)
          } catch {
            return options.fallbackReply
          }
        }

        return options.fallbackReply
      }

      void resolveReply().then((reply) => {
        if (requestId !== requestRef.current) return

        const minDoneAt = startedAt + TYPING_APPEAR_DELAY_MS + MIN_TYPING_MS
        const waitMs = Math.max(0, minDoneAt - Date.now())

        replyRef.current = setTimeout(() => {
          if (requestId !== requestRef.current) return

          setMessages((prev) => {
            const hasBot = prev.some((m) => m.id === botId)

            if (!hasBot) {
              return [
                ...prev,
                { id: botId, role: 'bot', content: reply, isTyping: false },
              ]
            }

            return prev.map((msg) =>
              msg.id === botId
                ? { ...msg, content: reply, isTyping: false }
                : msg,
            )
          })
        }, waitMs)
      })
    },
    [clearTimers, options.apiBaseUrl, options.fallbackReply, setMessages],
  )

  return { sendMessage, clearTimers }
}
