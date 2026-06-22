import type { LauncherSettings, RayaConfig, WidgetPosition } from '../types'

const DEFAULT_LAUNCHER: LauncherSettings = {
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
}

function clampSize(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  return Math.min(80, Math.max(40, value))
}

function resolvePosition(
  value: WidgetPosition | undefined,
  fallback: WidgetPosition,
): WidgetPosition {
  return value === 'bottom-left' || value === 'bottom-right' ? value : fallback
}

export function resolveLauncherConfig(config: Partial<RayaConfig>): LauncherSettings {
  const launcher = config.launcher ?? {}
  const basePosition = resolvePosition(
    config.position ?? launcher.position,
    DEFAULT_LAUNCHER.position,
  )
  const baseSize = clampSize(launcher.size ?? config.launcherSize, DEFAULT_LAUNCHER.size)

  return {
    size: baseSize,
    sizeMobile: clampSize(launcher.sizeMobile, baseSize),
    sizeTablet: clampSize(launcher.sizeTablet, baseSize),
    sizeDesktop: clampSize(launcher.sizeDesktop, baseSize),
    position: basePosition,
    positionMobile: resolvePosition(launcher.positionMobile, basePosition),
    positionTablet: resolvePosition(launcher.positionTablet, basePosition),
    positionDesktop: resolvePosition(launcher.positionDesktop, basePosition),
    offsetBottom:
      typeof launcher.offsetBottom === 'number' ? launcher.offsetBottom : DEFAULT_LAUNCHER.offsetBottom,
    offsetSide:
      typeof launcher.offsetSide === 'number' ? launcher.offsetSide : DEFAULT_LAUNCHER.offsetSide,
  }
}

export function launcherToCssVars(launcher: LauncherSettings): Record<string, string> {
  return {
    '--raya-launcher-size-mobile': `${launcher.sizeMobile}px`,
    '--raya-launcher-size-tablet': `${launcher.sizeTablet}px`,
    '--raya-launcher-size-desktop': `${launcher.sizeDesktop}px`,
    '--raya-launcher-offset-bottom': `${launcher.offsetBottom}px`,
    '--raya-launcher-offset-side': `${launcher.offsetSide}px`,
  }
}

export function positionToSide(position: WidgetPosition): 'left' | 'right' {
  return position === 'bottom-left' ? 'left' : 'right'
}
