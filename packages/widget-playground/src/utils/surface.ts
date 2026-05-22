import type { CSSObject } from '@mui/material'
import { safe6DigitHexColor } from './color.js'
import { buildBoxShadow, parseBoxShadow, parseCssBorder } from './theme.js'

interface ShadowState {
  on: boolean
  offsetX: number
  offsetY: number
  blur: number
  spread: number
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
  spread: 0,
}

export const COMPONENT_SHADOW_DEFAULTS = {
  offsetX: 0,
  offsetY: 8,
  blur: 4,
  spread: 0,
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
  shadowSpread: number
  onShadowSpreadChange: (spread: number) => void
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
  valueKey: 'shadowOffsetX' | 'shadowOffsetY' | 'shadowBlur' | 'shadowSpread'
  onChangeKey:
    | 'onShadowOffsetXChange'
    | 'onShadowOffsetYChange'
    | 'onShadowBlurChange'
    | 'onShadowSpreadChange'
}

export const SHADOW_SLIDER_FIELDS: ShadowSliderField[] = [
  {
    label: 'Offset X',
    ariaSuffix: 'shadow offset x',
    min: -8,
    max: 8,
    valueKey: 'shadowOffsetX',
    onChangeKey: 'onShadowOffsetXChange',
  },
  {
    label: 'Offset Y',
    ariaSuffix: 'shadow offset y',
    min: -8,
    max: 8,
    valueKey: 'shadowOffsetY',
    onChangeKey: 'onShadowOffsetYChange',
  },
  {
    label: 'Blur',
    ariaSuffix: 'shadow blur',
    min: 0,
    max: 32,
    valueKey: 'shadowBlur',
    onChangeKey: 'onShadowBlurChange',
  },
  {
    label: 'Spread',
    ariaSuffix: 'shadow spread',
    min: 0,
    max: 8,
    valueKey: 'shadowSpread',
    onChangeKey: 'onShadowSpreadChange',
  },
]

export function parseShadowState(
  boxShadow: unknown,
  defaults: { offsetX: number; offsetY: number; blur: number; spread: number }
): ShadowState {
  const str = typeof boxShadow === 'string' ? boxShadow : ''
  const on = !!str && str !== 'none'
  const parsed = on ? parseBoxShadow(str) : defaults
  return { on, ...parsed }
}

export function extractCssObject(root: unknown): CSSObject {
  return root && typeof root === 'object' && !Array.isArray(root)
    ? (root as CSSObject)
    : {}
}

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

export function buildSurfaceHandlers(
  shadow: ShadowState,
  border: BorderState,
  update: (patch: Record<string, string | number | undefined>) => void,
  borderOffValue: string | undefined = 'none'
): SurfaceHandlers {
  const makeShadow = (overrides: Partial<ShadowState>): string =>
    buildBoxShadow(
      overrides.offsetX ?? shadow.offsetX,
      overrides.offsetY ?? shadow.offsetY,
      overrides.blur ?? shadow.blur,
      overrides.spread ?? shadow.spread
    )

  return {
    shadowOn: shadow.on,
    onShadowOnChange: (on) =>
      update({ boxShadow: on ? makeShadow({}) : 'none' }),
    shadowOffsetX: shadow.offsetX,
    onShadowOffsetXChange: (x) =>
      update({ boxShadow: shadow.on ? makeShadow({ offsetX: x }) : 'none' }),
    shadowOffsetY: shadow.offsetY,
    onShadowOffsetYChange: (y) =>
      update({ boxShadow: shadow.on ? makeShadow({ offsetY: y }) : 'none' }),
    shadowBlur: shadow.blur,
    onShadowBlurChange: (blur) =>
      update({ boxShadow: shadow.on ? makeShadow({ blur }) : 'none' }),
    shadowSpread: shadow.spread,
    onShadowSpreadChange: (spread) =>
      update({ boxShadow: shadow.on ? makeShadow({ spread }) : 'none' }),
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
