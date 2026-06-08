import { FAQ_ITEMS } from '../data/faqs'
import type { FaqItem } from '../types'
import { ChevronLeftIcon } from './icons'
import styles from '../styles/widget.module.css'

interface FaqListProps {
  onSelect: (faq: FaqItem) => void
}

export function FaqList({ onSelect }: FaqListProps) {
  return (
    <div className={styles.faqList}>
      {FAQ_ITEMS.map((faq) => (
        <button
          key={faq.id}
          type="button"
          className={styles.faqCard}
          onClick={() => onSelect(faq)}
        >
          <span className={styles.faqChevron}>
            <ChevronLeftIcon />
          </span>
          <span className={styles.faqContent}>
            <span className={styles.faqTitle}>{faq.title}</span>
            <span className={styles.faqDescription}>{faq.description}</span>
          </span>
        </button>
      ))}
    </div>
  )
}
