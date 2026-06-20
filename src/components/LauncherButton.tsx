import { useEffect, useState } from 'preact/hooks'
import { ChatIcon, CloseIcon } from './icons'
import styles from '../styles.module.css'

interface LauncherButtonProps {
  label: string
  isOpen: boolean
  onToggle: () => void
}

export function LauncherButton({ label, isOpen, onToggle }: LauncherButtonProps) {
  const [bootExpanded, setBootExpanded] = useState(true)
  const [hovered, setHovered] = useState(false)
  const isWide = bootExpanded || hovered

  useEffect(() => {
    const timer = setTimeout(() => setBootExpanded(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <button
      type="button"
      className={`${styles.launcher} ${isWide ? styles.launcherWide : ''}`}
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={isOpen ? 'بستن چت' : 'باز کردن چت'}
      aria-expanded={isOpen}
    >
      <span className={styles.launcherIcon}>
        {isOpen ? <CloseIcon size={22} /> : <ChatIcon size={22} />}
      </span>
      <span className={styles.launcherLabelWrap}>
        <span className={styles.launcherLabel}>{label}</span>
      </span>
    </button>
  )
}
