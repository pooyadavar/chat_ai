import { render } from 'preact'
import { App } from './App'
import fontStyles from './styles/fonts.css?inline'
import appStyles from './styles.module.css?inline'
import { DEFAULT_CONFIG, type FaqItem, type RayaConfig, type RayaWidgetConfig } from './types'
import { resolveLauncherConfig } from './utils/launcherConfig'

const HOST_STYLES = `
:host {
  all: initial;
  display: block;
  position: fixed;
  z-index: 999999;
}
`

const FONT_STYLE_ID = 'raya-widget-fonts'

function pickDefined<T extends Record<string, unknown>>(source: T | null | undefined): Partial<T> {
  if (!source) return {}

  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => value !== undefined),
  ) as Partial<T>
}

function normalizeFaqs(faqs: FaqItem[] | undefined): FaqItem[] | undefined {
  if (!faqs) return undefined

  return faqs.map((faq, index) => ({
    id: faq.id || `faq-${index + 1}`,
    title: faq.title,
    description: faq.description ?? '',
    botResponse: faq.botResponse,
  }))
}

function normalizeApiBaseUrl(url: string): string {
  return url.replace(/\/$/, '')
}

/** Priority: defaults → window.RAYA_CONFIG */
export function mergeConfig(
  defaults: RayaWidgetConfig,
  local?: Partial<RayaConfig> | null,
): RayaWidgetConfig {
  const localClean = pickDefined(local)

  const merged = {
    ...defaults,
    ...localClean,
    apiBaseUrl: normalizeApiBaseUrl(localClean.apiBaseUrl ?? defaults.apiBaseUrl),
    faqs: normalizeFaqs(localClean.faqs) ?? defaults.faqs,
    launcher: resolveLauncherConfig({
      position: localClean.position ?? defaults.position,
      launcherSize: localClean.launcherSize,
      launcher: {
        ...defaults.launcher,
        ...local?.launcher,
      },
    }),
  }

  return {
    ...merged,
    position: merged.launcher.position,
  }
}

async function pingBackend(apiBaseUrl: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiBaseUrl}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
    return response.ok
  } catch {
    return false
  }
}

function injectGlobalFonts(): void {
  if (document.getElementById(FONT_STYLE_ID)) return

  const fontEl = document.createElement('style')
  fontEl.id = FONT_STYLE_ID
  fontEl.textContent = fontStyles
  document.head.appendChild(fontEl)
}

function mountWidget(config: RayaWidgetConfig): void {
  injectGlobalFonts()

  const host = document.createElement('div')
  host.id = 'raya-widget-host'
  document.body.appendChild(host)

  const shadow = host.attachShadow({ mode: 'open' })

  const styleEl = document.createElement('style')
  styleEl.textContent = `${HOST_STYLES}\n${appStyles}`
  shadow.appendChild(styleEl)

  const mount = document.createElement('div')
  mount.id = 'raya-widget-root'
  shadow.appendChild(mount)

  render(<App config={config} />, mount)
}

async function bootstrap(): Promise<void> {
  const localConfig = window.RAYA_CONFIG ?? null
  const config = mergeConfig(DEFAULT_CONFIG, localConfig)

  const backendOk = await pingBackend(config.apiBaseUrl)
  if (!backendOk) {
    console.warn(
      `[Raya] Backend not reachable at ${config.apiBaseUrl}. Chat will use fallback replies.`,
    )
  }

  mountWidget(config)
}

bootstrap()
