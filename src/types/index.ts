export interface FaqItem {
  id: string
  title: string
  description: string
  botResponse: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  content: string
  isStreaming?: boolean
  isTyping?: boolean
}
