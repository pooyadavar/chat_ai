import { CloseIcon, NewChatIcon } from './icons'
import { FaqList } from './FaqList'
import { ChatStream } from './ChatStream'
import { ChatInput } from './ChatInput'
import type { ChatMessage, FaqItem, RayaWidgetConfig } from '../types'
import styles from '../styles.module.css'

interface ChatWindowProps {
  config: RayaWidgetConfig
  isOpen: boolean
  view: 'faq' | 'chat'
  messages: ChatMessage[]
  isReplying: boolean
  onClose: () => void
  onNewChat: () => void
  onFaqSelect: (faq: FaqItem) => void
  onSend: (text: string) => void
}

export function ChatWindow({
  config,
  isOpen,
  view,
  messages,
  isReplying,
  onClose,
  onNewChat,
  onFaqSelect,
  onSend,
}: ChatWindowProps) {
  return (
    <div
      className={`${styles.chatWindow} ${isOpen ? styles.chatWindowOpen : ''}`}
      role="dialog"
      aria-label="چت پشتیبانی رایا"
      aria-hidden={!isOpen}
    >
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <span className={styles.headerTitle}>{config.headerTitle}</span>
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
            <h2 className={styles.welcomeTitle}>{config.welcomeText}</h2>
            <p className={styles.welcomeSubtitle}>{config.welcomeSubtitle}</p>
            <FaqList faqs={config.faqs} onSelect={onFaqSelect} />
          </section>
        </div>

        <div
          className={`${styles.viewPanel} ${view === 'chat' ? styles.viewActive : styles.viewHidden}`}
          aria-hidden={view !== 'chat'}
        >
          <ChatStream messages={messages} />
        </div>
      </div>

      <ChatInput onSend={onSend} disabled={isReplying} />
    </div>
  )
}
