import styles from '../styles.module.css'

export function TypingIndicator() {
  return (
    <span className={styles.typingDots} aria-hidden="true">
      <span className={styles.typingDot} />
      <span className={styles.typingDot} />
      <span className={styles.typingDot} />
    </span>
  )
}
