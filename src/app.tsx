import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'
import { LauncherButton } from './components/LauncherButton'
import { ChatWindow } from './components/ChatWindow'
import { useMessageStream } from './hooks/useMessageStream'
import { clearSession, loadSession, saveSession } from './utils/storage'
import { launcherToCssVars, positionToSide } from './utils/launcherConfig'
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
    ...launcherToCssVars(config.launcher),
  }
}

export function App({ config }: AppProps) {
  const stored = config.enableChatHistory ? loadSession(config.apiBaseUrl) : null

  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<'faq' | 'chat'>(stored?.view ?? 'faq')
  const [messages, setMessages] = useState<ChatMessage[]>(stored?.messages ?? [])
  const [isReplying, setIsReplying] = useState(false)

  const themeStyle = useMemo(() => configToCssVars(config), [config])
  const { launcher } = config

  const { sendMessage, clearTimers } = useMessageStream(
    (updater) => {
      setMessages((prev) => {
        const next = updater(prev)
        const replying = next.some((m) => m.isTyping)
        setIsReplying(replying)
        return next
      })
    },
    {
      apiBaseUrl: config.apiBaseUrl,
      fallbackReply: config.defaultBotResponse,
    },
  )

  useEffect(() => {
    if (!config.enableChatHistory) return

    if (messages.length === 0 && view === 'faq') {
      clearSession(config.apiBaseUrl)
      return
    }

    saveSession(config.apiBaseUrl, { messages, view })
  }, [messages, view, config.apiBaseUrl, config.enableChatHistory])

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
    setIsReplying(false)

    if (config.enableChatHistory) {
      clearSession(config.apiBaseUrl)
    }
  }, [clearTimers, config.apiBaseUrl, config.enableChatHistory])

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
      sendMessage(text)
    },
    [sendMessage],
  )

  return (
    <div
      className={styles.widget}
      style={themeStyle}
      data-launcher-pos-mobile={positionToSide(launcher.positionMobile)}
      data-launcher-pos-tablet={positionToSide(launcher.positionTablet)}
      data-launcher-pos-desktop={positionToSide(launcher.positionDesktop)}
    >
      <ChatWindow
        config={config}
        isOpen={isOpen}
        view={view}
        messages={messages}
        isReplying={isReplying}
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
