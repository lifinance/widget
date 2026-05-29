import type { WidgetConfig } from '@lifi/widget'
import type { CSSObject } from '@mui/material'
import { safe6DigitHexColor } from './color.js'

/** Extracts a numeric pixel value from a CSS value ("16px" -> 16, 16 -> 16). Returns fallback when value is undefined, empty, or unparseable. */
export function pxFromCss(
  value: string | number | undefined,
  fallback: number
): number {
  if (value === undefined || value === '') {
    return fallback
  }
  if (typeof value === 'number') {
    return value
  }
  const n = Number.parseInt(String(value).replace(/px/g, '').trim(), 10)
  return Number.isFinite(n) ? n : fallback
}

/** Constructs a filter drop-shadow CSS string with a fixed rgba(0,0,0,0.12) color. */
export function buildDropShadow(
  offsetX: number,
  offsetY: number,
  blur: number
): string {
  return `drop-shadow(${offsetX}px ${offsetY}px ${blur}px rgba(0, 0, 0, 0.12))`
}

/** Inverse of buildDropShadow — extracts offsetX/Y and blur from a filter string. */
export function parseDropShadow(filter: string): {
  offsetX: number
  offsetY: number
  blur: number
} {
  const match = filter.match(
    /drop-shadow\s*\(\s*(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(\d+(?:\.\d+)?)px/
  )
  if (match) {
    return {
      offsetX: Number.parseInt(match[1], 10),
      offsetY: Number.parseInt(match[2], 10),
      blur: Math.max(0, Number.parseInt(match[3], 10)),
    }
  }
  return { offsetX: 0, offsetY: 8, blur: 32 }
}

/** Parses a CSS border shorthand ("2px solid #E5E7EB") into { on, width, color }. Returns on: false with defaults when border is undefined/empty/"none". */
export function parseCssBorder(border: string | number | undefined): {
  on: boolean
  width: number
  color: string
} {
  if (border === undefined || border === '' || border === 'none') {
    return { on: false, width: 1, color: '#E5E7EB' }
  }
  const s = String(border).trim()
  const wMatch = s.match(/^(\d+(?:\.\d+)?)px/)
  const width = wMatch ? Math.max(1, Math.round(Number(wMatch[1]))) : 1
  const colorMatch = s.match(/solid\s+(.+)$/i)
  let color = '#E5E7EB'
  if (colorMatch?.[1]) {
    const c = colorMatch[1].trim()
    if (c.startsWith('#')) {
      color = safe6DigitHexColor(c)
    }
  }
  return { on: true, width, color }
}

/** Deep-merges a CSS patch into theme.components.[MuiCard|MuiButton].styleOverrides.root, preserving existing overrides. Resets MuiCard variants to [] to prevent stale variant styles. */
export function mergeComponentRoot(
  config: Partial<WidgetConfig> | undefined,
  componentName: 'MuiCard' | 'MuiButton',
  patch: CSSObject
): Partial<WidgetConfig> {
  const theme = config?.theme
  const existing = theme?.components?.[componentName]
  const styleOverrides = existing?.styleOverrides
  const root = styleOverrides?.root
  const prevRoot =
    root && typeof root === 'object' && !Array.isArray(root)
      ? (root as CSSObject)
      : {}

  return {
    theme: {
      ...theme,
      components: {
        ...theme?.components,
        [componentName]: {
          ...existing,
          ...(componentName === 'MuiCard' && { variants: [] }),
          styleOverrides: {
            ...styleOverrides,
            root: {
              ...prevRoot,
              ...patch,
            },
          },
        },
      },
    },
  }
}
