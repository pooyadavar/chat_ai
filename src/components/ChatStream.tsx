import { useEffect, useRef } from 'preact/hooks'
import type { ChatMessage } from '../types'
import { TypingIndicator } from './TypingIndicator'
import styles from '../styles.module.css'

interface ChatStreamProps {
  messages: ChatMessage[]
}

export function ChatStream({ messages }: ChatStreamProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className={styles.chatStream}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`${styles.messageRow} ${
            msg.role === 'user' ? styles.messageRowUser : styles.messageRowBot
          }`}
        >
          <div
            className={`${styles.bubble} ${
              msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot
            } ${msg.isTyping ? styles.bubbleTyping : ''} ${
              msg.role === 'bot' && !msg.isTyping ? styles.bubbleReveal : ''
            }`}
          >
            {msg.isTyping ? <TypingIndicator /> : msg.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
