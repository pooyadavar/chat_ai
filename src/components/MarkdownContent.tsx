import { useMemo } from 'preact/hooks'
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import styles from '../styles.module.css'

marked.setOptions({
  breaks: true,
  gfm: true,
})

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const html = useMemo(() => {
    const raw = marked.parse(content, { async: false }) as string
    return DOMPurify.sanitize(raw)
  }, [content])

  return (
    <div
      className={styles.markdown}
      dir="auto"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
