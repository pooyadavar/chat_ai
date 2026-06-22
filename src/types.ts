import { DEFAULT_BOT_RESPONSE, FAQ_ITEMS } from './data/faqs'

export type WidgetPosition = 'bottom-right' | 'bottom-left'

export interface LauncherConfigInput {
  /** Circle diameter (px) — fallback for all breakpoints */
  size?: number
  sizeMobile?: number
  sizeTablet?: number
  sizeDesktop?: number
  /** Position — fallback for all breakpoints */
  position?: WidgetPosition
  positionMobile?: WidgetPosition
  positionTablet?: WidgetPosition
  positionDesktop?: WidgetPosition
  offsetBottom?: number
  offsetSide?: number
}

export interface LauncherSettings {
  size: number
  sizeMobile: number
  sizeTablet: number
  sizeDesktop: number
  position: WidgetPosition
  positionMobile: WidgetPosition
  positionTablet: WidgetPosition
  positionDesktop: WidgetPosition
  offsetBottom: number
  offsetSide: number
}

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

/** Partial config from `window.RAYA_CONFIG` */
export interface RayaConfig {
  primaryColor?: string
  position?: WidgetPosition
  /** @deprecated Use launcher.size */
  launcherSize?: number
  launcher?: LauncherConfigInput
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
  primaryColor: string
  position: WidgetPosition
  launcher: LauncherSettings
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
  primaryColor: '#EF394E',
  position: 'bottom-right',
  launcher: {
    size: 56,
    sizeMobile: 48,
    sizeTablet: 52,
    sizeDesktop: 56,
    position: 'bottom-right',
    positionMobile: 'bottom-right',
    positionTablet: 'bottom-right',
    positionDesktop: 'bottom-right',
    offsetBottom: 20,
    offsetSide: 20,
  },
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
