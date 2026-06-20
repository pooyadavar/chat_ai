import { DEFAULT_BOT_RESPONSE, FAQ_ITEMS } from './data/faqs'

export type WidgetPosition = 'bottom-right' | 'bottom-left'

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
  isTyping?: boolean
}

/** Partial config from `window.RAYA_CONFIG` or API init response */
export interface RayaConfig {
  apiKey?: string
  primaryColor?: string
  position?: WidgetPosition
  fontFamily?: string
  welcomeText?: string
  welcomeSubtitle?: string
  enableChatHistory?: boolean
  launcherLabel?: string
  headerTitle?: string
  faqs?: FaqItem[]
  defaultBotResponse?: string
  apiBaseUrl?: string
}

/** Fully resolved widget configuration after merge */
export interface RayaWidgetConfig {
  apiKey: string | null
  primaryColor: string
  position: WidgetPosition
  fontFamily: string
  welcomeText: string
  welcomeSubtitle: string
  enableChatHistory: boolean
  launcherLabel: string
  headerTitle: string
  faqs: FaqItem[]
  defaultBotResponse: string
  apiBaseUrl: string
}

export const DEFAULT_CONFIG: RayaWidgetConfig = {
  apiKey: null,
  primaryColor: '#EF394E',
  position: 'bottom-right',
  fontFamily: "'IRANSansX', Tahoma, sans-serif",
  welcomeText: 'سلام! 👋',
  welcomeSubtitle: 'من دستیار پشتیبان رایا هستم، چطور می‌تونم کمکتون کنم؟',
  enableChatHistory: true,
  launcherLabel: 'پشتیبان هوشمند',
  headerTitle: 'پشتیبان هوشمند رایا',
  faqs: FAQ_ITEMS,
  defaultBotResponse: DEFAULT_BOT_RESPONSE,
  apiBaseUrl: 'http://localhost:3001',
}

declare global {
  interface Window {
    RAYA_CONFIG?: Partial<RayaConfig>
  }
}
