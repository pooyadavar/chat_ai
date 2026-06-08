import { CloseIcon, NewChatIcon } from './icons'
import { FaqList } from './FaqList'
import { ChatStream } from './ChatStream'
import { ChatInput } from './ChatInput'
import { getWelcomeGreeting } from '../utils/greeting'
import type { ChatMessage, FaqItem } from '../types'
import styles from '../styles/widget.module.css'

interface ChatWindowProps {
  isOpen: boolean
  view: 'faq' | 'chat'
  messages: ChatMessage[]
  isStreaming: boolean
  onClose: () => void
  onNewChat: () => void
  onFaqSelect: (faq: FaqItem) => void
  onSend: (text: string) => void
}

export function ChatWindow({
  isOpen,
  view,
  messages,
  isStreaming,
  onClose,
  onNewChat,
  onFaqSelect,
  onSend,
}: ChatWindowProps) {
  if (!isOpen) return null

  return (
    <div className={styles.chatWindow} role="dialog" aria-label="چت پشتیبانی رایا">
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <span className={styles.headerTitle}>پشتیبان هوشمند رایا</span>
          <span className={styles.statusRow}>
            <span className={styles.statusDot} />
            <span className={styles.statusText}>آنلاین</span>
          </span>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.headerAction}
            onClick={onNewChat}
            aria-label="گفتگوی جدید"
            title="گفتگوی جدید"
          >
            <NewChatIcon size={18} />
          </button>
          <button
            type="button"
            className={styles.headerAction}
            onClick={onClose}
            aria-label="بستن پنجره چت"
          >
            <CloseIcon size={18} />
          </button>
        </div>
      </header>

      <div className={styles.body}>
        <div
          className={`${styles.viewPanel} ${view === 'faq' ? styles.viewActive : styles.viewHidden}`}
          aria-hidden={view !== 'faq'}
        >
          <section className={styles.welcomeSection}>
            <h2 className={styles.welcomeTitle}>{getWelcomeGreeting()}</h2>
            <p className={styles.welcomeSubtitle}>
              من دستیار پشتیبان رایا هستم، چطور می‌تونم کمکتون کنم؟
            </p>
            <FaqList onSelect={onFaqSelect} />
          </section>
        </div>

        <div
          className={`${styles.viewPanel} ${view === 'chat' ? styles.viewActive : styles.viewHidden}`}
          aria-hidden={view !== 'chat'}
        >
          <ChatStream messages={messages} />
        </div>
      </div>

      <ChatInput onSend={onSend} disabled={isStreaming} />
    </div>
  )
}
