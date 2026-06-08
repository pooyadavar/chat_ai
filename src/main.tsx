import { render } from 'preact'
import { App } from './App'
import fontStyles from './styles/fonts.css?inline'
import widgetStyles from './styles/widget.module.css?inline'

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

function bootstrap() {
  const script = getCurrentScript()
  const apiKey = script?.getAttribute('data-api-key') ?? null

  const host = document.createElement('div')
  host.id = 'raya-widget-host'
  document.body.appendChild(host)

  const shadow = host.attachShadow({ mode: 'open' })

  const styleEl = document.createElement('style')
  styleEl.textContent = `${fontStyles}\n${widgetStyles}`
  shadow.appendChild(styleEl)

  const mount = document.createElement('div')
  mount.id = 'raya-widget-root'
  shadow.appendChild(mount)

  render(<App apiKey={apiKey} />, mount)
}

bootstrap()
