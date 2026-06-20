import { render } from 'preact'
import { App } from './App'
import fontStyles from './styles/fonts.css?inline'
import appStyles from './styles.module.css?inline'
import { DEFAULT_CONFIG, type RayaConfig, type RayaWidgetConfig } from './types'

const INIT_API = 'https://api.raya.ai/v1/widget/init'

const HOST_STYLES = `
:host {
  all: initial;
  display: block;
  position: fixed;
  z-index: 999999;
}
`

function getCurrentScript(): HTMLScriptElement | null {
  if (document.currentScript instanceof HTMLScriptElement) {
    return document.currentScript
  }

  return (
    document.querySelector<HTMLScriptElement>('script[data-api-key]') ??
    document.querySelector<HTMLScriptElement>('script[src*="main"]') ??
    document.querySelector<HTMLScriptElement>('script[src*="raya"]')
  )
}

function pickDefined<T extends Record<string, unknown>>(source: T | null | undefined): Partial<T> {
  if (!source) return {}

  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => value !== undefined),
  ) as Partial<T>
}

/** Priority: defaults → window.RAYA_CONFIG → API response */
export function mergeConfig(
  defaults: RayaWidgetConfig,
  local?: Partial<RayaConfig> | null,
  remote?: Partial<RayaConfig> | null,
): RayaWidgetConfig {
  return {
    ...defaults,
    ...pickDefined(local),
    ...pickDefined(remote),
    apiKey: remote?.apiKey ?? local?.apiKey ?? defaults.apiKey,
  }
}

async function fetchRemoteConfig(apiKey: string): Promise<Partial<RayaConfig> | null> {
  try {
    const url = `${INIT_API}?apiKey=${encodeURIComponent(apiKey)}`
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })

    if (!response.ok) return null

    const data = (await response.json()) as Partial<RayaConfig>
    return data
  } catch {
    return null
  }
}

const FONT_STYLE_ID = 'raya-widget-fonts'

/** @font-face inside Shadow DOM is unreliable — register fonts on document */
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
  const script = getCurrentScript()
  const scriptApiKey = script?.getAttribute('data-api-key') ?? null
  const localConfig = window.RAYA_CONFIG ?? null

  const apiKey =
    scriptApiKey ?? localConfig?.apiKey ?? DEFAULT_CONFIG.apiKey

  let remoteConfig: Partial<RayaConfig> | null = null

  if (apiKey) {
    remoteConfig = await fetchRemoteConfig(apiKey)
  }

  const config = mergeConfig(
    { ...DEFAULT_CONFIG, apiKey },
    localConfig,
    remoteConfig,
  )

  mountWidget(config)
}

bootstrap()
