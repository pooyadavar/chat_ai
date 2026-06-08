import { useEffect, useState } from 'preact/hooks'
import { ChatIcon, CloseIcon } from './icons'
import styles from '../styles/widget.module.css'

interface LauncherButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export function LauncherButton({ isOpen, onToggle }: LauncherButtonProps) {
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setExpanded(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <button
      type="button"
      className={`${styles.launcher} ${expanded ? styles.launcherExpanded : styles.launcherCollapsed}`}
      onClick={onToggle}
      aria-label={isOpen ? 'بستن چت' : 'باز کردن چت'}
      aria-expanded={isOpen}
    >
      <span className={styles.launcherIcon}>
        {isOpen ? <CloseIcon size={22} /> : <ChatIcon size={22} />}
      </span>
      <span className={styles.launcherLabel}>پشتیبان هوشمند</span>
    </button>
  )
}
