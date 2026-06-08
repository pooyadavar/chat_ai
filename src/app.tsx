import { useCallback, useEffect, useState } from 'preact/hooks'
import { LauncherButton } from './components/LauncherButton'
import { ChatWindow } from './components/ChatWindow'
import { useMessageStream } from './hooks/useMessageStream'
import { DEFAULT_BOT_RESPONSE } from './data/faqs'
import { clearSession, loadSession, saveSession } from './utils/storage'
import type { ChatMessage, FaqItem } from './types'
import styles from './styles/widget.module.css'

interface AppProps {
  apiKey: string | null
}

export function App({ apiKey }: AppProps) {
  const stored = loadSession(apiKey)

  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<'faq' | 'chat'>(stored?.view ?? 'faq')
  const [messages, setMessages] = useState<ChatMessage[]>(stored?.messages ?? [])
  const [isStreaming, setIsStreaming] = useState(false)

  const { sendMessage, clearTimers } = useMessageStream((updater) => {
    setMessages((prev) => {
      const next = updater(prev)
      const streaming = next.some((m) => m.isStreaming || m.isTyping)
      setIsStreaming(streaming)
      return next
    })
  })

  useEffect(() => {
    if (messages.length === 0 && view === 'faq') {
      clearSession(apiKey)
      return
    }
    saveSession(apiKey, { messages, view })
  }, [messages, view, apiKey])

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleNewChat = useCallback(() => {
    clearTimers()
    setMessages([])
    setView('faq')
    setIsStreaming(false)
    clearSession(apiKey)
  }, [clearTimers, apiKey])

  const handleFaqSelect = useCallback(
    (faq: FaqItem) => {
      setView('chat')
      sendMessage(faq.title, faq.botResponse)
    },
    [sendMessage],
  )

  const handleSend = useCallback(
    (text: string) => {
      setView('chat')
      sendMessage(text, DEFAULT_BOT_RESPONSE)
    },
    [sendMessage],
  )

  return (
    <div className={styles.widget} data-api-key={apiKey ?? undefined}>
      <ChatWindow
        isOpen={isOpen}
        view={view}
        messages={messages}
        isStreaming={isStreaming}
        onClose={handleClose}
        onNewChat={handleNewChat}
        onFaqSelect={handleFaqSelect}
        onSend={handleSend}
      />
      <LauncherButton isOpen={isOpen} onToggle={handleToggle} />
    </div>
  )
}
