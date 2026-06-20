import type { FaqItem } from '../types'
import { ChevronLeftIcon } from './icons'
import styles from '../styles.module.css'

interface FaqListProps {
  faqs: FaqItem[]
  onSelect: (faq: FaqItem) => void
}

export function FaqList({ faqs, onSelect }: FaqListProps) {
  return (
    <div className={styles.faqList}>
      {faqs.map((faq) => (
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
