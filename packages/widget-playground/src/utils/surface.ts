import type { CSSObject } from '@mui/material'
import { safe6DigitHexColor } from './color.js'
import { buildDropShadow, parseCssBorder, parseDropShadow } from './theme.js'

interface ShadowState {
  on: boolean
  offsetX: number
  offsetY: number
  blur: number
}

interface BorderState {
  on: boolean
  width: number
  color: string
}

export const WIDGET_SHADOW_DEFAULTS = {
  offsetX: 0,
  offsetY: 8,
  blur: 32,
}

export const COMPONENT_SHADOW_DEFAULTS = {
  offsetX: 0,
  offsetY: 8,
  blur: 4,
}

export interface SurfaceHandlers {
  shadowOn: boolean
  onShadowOnChange: (on: boolean) => void
  shadowOffsetX: number
  onShadowOffsetXChange: (x: number) => void
  shadowOffsetY: number
  onShadowOffsetYChange: (y: number) => void
  shadowBlur: number
  onShadowBlurChange: (blur: number) => void
  borderOn: boolean
  onBorderOnChange: (on: boolean) => void
  borderColor: string
  onBorderColorChange: (hex: string) => void
  borderWeight: number
  onBorderWeightChange: (w: number) => void
}

export interface SurfaceBlockProps extends SurfaceHandlers {
  title: string
  radius: number
  onRadiusChange: (n: number) => void
  radiusMax: number
}

export interface ShadowSliderField {
  label: string
  ariaSuffix: string
  min: number
  max: number
  valueKey: 'shadowOffsetX' | 'shadowOffsetY' | 'shadowBlur'
  onChangeKey:
    | 'onShadowOffsetXChange'
    | 'onShadowOffsetYChange'
    | 'onShadowBlurChange'
}

export const SHADOW_SLIDER_FIELDS: ShadowSliderField[] = [
  {
    label: 'Offset X',
    ariaSuffix: 'drop shadow offset x',
    min: -8,
    max: 8,
    valueKey: 'shadowOffsetX',
    onChangeKey: 'onShadowOffsetXChange',
  },
  {
    label: 'Offset Y',
    ariaSuffix: 'drop shadow offset y',
    min: -8,
    max: 8,
    valueKey: 'shadowOffsetY',
    onChangeKey: 'onShadowOffsetYChange',
  },
  {
    label: 'Blur',
    ariaSuffix: 'drop shadow blur',
    min: 0,
    max: 32,
    valueKey: 'shadowBlur',
    onChangeKey: 'onShadowBlurChange',
  },
]

const shadowOffPatch = { filter: 'none', boxShadow: 'none' } as const

/** Parses filter drop-shadow CSS into toggle state plus offset/blur, using defaults when off or missing. */
export function parseShadowState(
  filter: unknown,
  defaults: { offsetX: number; offsetY: number; blur: number }
): ShadowState {
  const filterStr = typeof filter === 'string' ? filter : ''
  if (filterStr && filterStr !== 'none') {
    return { on: true, ...parseDropShadow(filterStr) }
  }

  return { on: false, ...defaults }
}

export function extractCssObject(root: unknown): CSSObject {
  return root && typeof root === 'object' && !Array.isArray(root)
    ? (root as CSSObject)
    : {}
}

/** Resolves MuiCard border state, including default outlined borders when variants were not customised. */
export function parseCardBorderState(
  cardRootObj: CSSObject,
  muiCard:
    | {
        variants?: unknown[]
        defaultProps?: { variant?: string }
      }
    | undefined,
  effectivePaletteMode: 'light' | 'dark',
  greyLight?: string,
  greyDark?: string
): BorderState {
  const cardBorderFallbackColor = safe6DigitHexColor(
    (effectivePaletteMode === 'dark' ? greyDark : greyLight) ?? '#E5E7EB'
  )
  const cardBorderFromRoot = parseCssBorder(
    cardRootObj.border as string | undefined
  )
  const cardVariantsEdited = muiCard?.variants?.length === 0
  const cardBorderExplicitlyOff =
    cardRootObj.border === 'none' ||
    cardRootObj.borderWidth === 0 ||
    cardRootObj.borderWidth === '0' ||
    cardRootObj.borderWidth === '0px'
  const cardBorderOn =
    cardBorderFromRoot.on ||
    (!cardVariantsEdited &&
      !cardBorderExplicitlyOff &&
      (muiCard?.defaultProps?.variant ?? 'outlined') === 'outlined')

  return {
    on: cardBorderOn,
    width: cardBorderFromRoot.on ? cardBorderFromRoot.width : 1,
    color: cardBorderFromRoot.on
      ? cardBorderFromRoot.color
      : cardBorderFallbackColor,
  }
}

/** Builds SurfaceBlock handlers that write shadow and border patches through the given update function. */
export function buildSurfaceHandlers(
  shadow: ShadowState,
  border: BorderState,
  update: (patch: Record<string, string | number | undefined>) => void,
  borderOffValue: string | undefined = 'none'
): SurfaceHandlers {
  const makeShadow = (overrides: Partial<ShadowState>): string =>
    buildDropShadow(
      overrides.offsetX ?? shadow.offsetX,
      overrides.offsetY ?? shadow.offsetY,
      overrides.blur ?? shadow.blur
    )

  const shadowPatch = (filter: string) => ({
    filter,
    boxShadow: 'none',
  })

  return {
    shadowOn: shadow.on,
    onShadowOnChange: (on) =>
      update(on ? shadowPatch(makeShadow({})) : shadowOffPatch),
    shadowOffsetX: shadow.offsetX,
    onShadowOffsetXChange: (x) =>
      update(
        shadow.on ? shadowPatch(makeShadow({ offsetX: x })) : shadowOffPatch
      ),
    shadowOffsetY: shadow.offsetY,
    onShadowOffsetYChange: (y) =>
      update(
        shadow.on ? shadowPatch(makeShadow({ offsetY: y })) : shadowOffPatch
      ),
    shadowBlur: shadow.blur,
    onShadowBlurChange: (blur) =>
      update(shadow.on ? shadowPatch(makeShadow({ blur })) : shadowOffPatch),
    borderOn: border.on,
    onBorderOnChange: (on) =>
      update({
        border: on ? `${border.width}px solid ${border.color}` : borderOffValue,
      }),
    borderColor: border.color,
    onBorderColorChange: (hex) =>
      update({
        border: border.on ? `${border.width}px solid ${hex}` : borderOffValue,
      }),
    borderWeight: border.width,
    onBorderWeightChange: (w) =>
      update({
        border: border.on ? `${w}px solid ${border.color}` : borderOffValue,
      }),
  }
}
