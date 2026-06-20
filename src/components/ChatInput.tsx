import { useState } from 'preact/hooks'
import type { JSX } from 'preact'
import { SendIcon } from './icons'
import styles from '../styles.module.css'

interface ChatInputProps {
  onSend: (text: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [sentPulse, setSentPulse] = useState(false)

  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    setSentPulse(true)
    window.setTimeout(() => setSentPulse(false), 400)
  }

  return (
    <form className={styles.inputArea} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.inputField}
        placeholder="سوالی دارید بپرسید..."
        value={value}
        onInput={(e) => setValue((e.target as HTMLInputElement).value)}
        disabled={disabled}
        dir="rtl"
      />
      <button
        type="submit"
        className={`${styles.sendButton} ${sentPulse ? styles.sendButtonPulse : ''}`}
        disabled={disabled || !value.trim()}
        aria-label="ارسال پیام"
      >
        <SendIcon size={18} />
      </button>
    </form>
  )
}
