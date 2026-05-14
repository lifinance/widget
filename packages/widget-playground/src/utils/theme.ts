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

/** Constructs a box-shadow CSS string with a fixed rgba(0,0,0,0.12) color. */
export function buildBoxShadow(
  offsetX: number,
  offsetY: number,
  blur: number,
  spread: number
): string {
  return `${offsetX}px ${offsetY}px ${blur}px ${spread}px rgba(0, 0, 0, 0.12)`
}

/** Inverse of buildBoxShadow — extracts offsetX/Y, blur, spread from a box-shadow string. Handles 3-value (no spread) and 4-value formats. Falls back to 0/8/32/0 defaults. */
export function parseBoxShadow(boxShadow: string): {
  offsetX: number
  offsetY: number
  blur: number
  spread: number
} {
  const px = boxShadow.match(/-?\d+px/g)
  if (px && px.length >= 4) {
    return {
      offsetX: Number.parseInt(px[0], 10),
      offsetY: Number.parseInt(px[1], 10),
      blur: Math.max(0, Number.parseInt(px[2], 10)),
      spread: Number.parseInt(px[3], 10),
    }
  }
  if (px && px.length >= 3) {
    return {
      offsetX: Number.parseInt(px[0], 10),
      offsetY: Number.parseInt(px[1], 10),
      blur: Math.max(0, Number.parseInt(px[2], 10)),
      spread: 0,
    }
  }
  return { offsetX: 0, offsetY: 8, blur: 32, spread: 0 }
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
