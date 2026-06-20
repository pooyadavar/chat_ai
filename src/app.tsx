import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { LauncherButton } from './components/LauncherButton'
import { ChatWindow } from './components/ChatWindow'
import { useMessageStream } from './hooks/useMessageStream'
import { clearSession, loadSession, saveSession } from './utils/storage'
import type { ChatMessage, FaqItem, RayaWidgetConfig } from './types'
import styles from './styles.module.css'

interface AppProps {
  config: RayaWidgetConfig
}

function darkenHex(hex: string, amount = 0.12): string {
  const normalized = hex.replace('#', '')
  if (normalized.length !== 6) return '#d63044'

  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  const factor = 1 - amount

  const channel = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value * factor)))
      .toString(16)
      .padStart(2, '0')

  return `#${channel(r)}${channel(g)}${channel(b)}`
}

function configToCssVars(config: RayaWidgetConfig): Record<string, string> {
  const primary = config.primaryColor

  return {
    '--raya-primary': primary,
    '--raya-primary-hover': darkenHex(primary),
    '--raya-primary-light': `color-mix(in srgb, ${primary} 12%, white)`,
    '--raya-font-family': config.fontFamily,
  }
}

export function App({ config }: AppProps) {
  const stored = config.enableChatHistory ? loadSession(config.apiKey) : null

  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<'faq' | 'chat'>(stored?.view ?? 'faq')
  const [messages, setMessages] = useState<ChatMessage[]>(stored?.messages ?? [])
  const [isStreaming, setIsStreaming] = useState(false)

  const themeStyle = useMemo(() => configToCssVars(config), [config])

  const positionClass =
    config.position === 'bottom-left'
      ? styles.positionBottomLeft
      : styles.positionBottomRight

  const { sendMessage, clearTimers } = useMessageStream((updater) => {
    setMessages((prev) => {
      const next = updater(prev)
      const streaming = next.some((m) => m.isStreaming || m.isTyping)
      setIsStreaming(streaming)
      return next
    })
  })

  useEffect(() => {
    if (!config.enableChatHistory) return

    if (messages.length === 0 && view === 'faq') {
      clearSession(config.apiKey)
      return
    }

    saveSession(config.apiKey, { messages, view })
  }, [messages, view, config.apiKey, config.enableChatHistory])

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

    if (config.enableChatHistory) {
      clearSession(config.apiKey)
    }
  }, [clearTimers, config.apiKey, config.enableChatHistory])

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
      sendMessage(text, config.defaultBotResponse)
    },
    [sendMessage, config.defaultBotResponse],
  )

  return (
    <div
      className={`${styles.widget} ${positionClass}`}
      style={themeStyle}
      data-api-key={config.apiKey ?? undefined}
    >
      <ChatWindow
        config={config}
        isOpen={isOpen}
        view={view}
        messages={messages}
        isStreaming={isStreaming}
        onClose={handleClose}
        onNewChat={handleNewChat}
        onFaqSelect={handleFaqSelect}
        onSend={handleSend}
      />
      <LauncherButton
        label={config.launcherLabel}
        isOpen={isOpen}
        onToggle={handleToggle}
      />
    </div>
  )
}
