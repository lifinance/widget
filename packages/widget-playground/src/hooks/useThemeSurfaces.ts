import type { CSSObject } from '@mui/material'
import { useCallback, useMemo, useRef } from 'react'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import { useWidgetConfigStore } from '../store/widgetConfig/WidgetConfigProvider.js'
import {
  buildSurfaceHandlers,
  COMPONENT_SHADOW_DEFAULTS,
  extractCssObject,
  parseCardBorderState,
  parseShadowState,
  type SurfaceBlockProps,
  WIDGET_SHADOW_DEFAULTS,
} from '../utils/surface.js'
import {
  mergeComponentRoot,
  parseCssBorder,
  pxFromCss,
} from '../utils/theme.js'

export function useThemeSurfaces(effectivePaletteMode: 'light' | 'dark'): {
  widget: SurfaceBlockProps
  card: SurfaceBlockProps
  button: SurfaceBlockProps
} {
  const { setContainer, setBorderRadius, setBorderRadiusSecondary, setConfig } =
    useConfigActions()
  const themeSnapshot = useWidgetConfigStore((s) => s.config?.theme)

  const configRef = useRef(themeSnapshot)
  configRef.current = themeSnapshot

  const updateContainer = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const current = configRef.current?.container ?? {}
      setContainer({ ...current, ...patch })
    },
    [setContainer]
  )

  const updateCardComponent = useCallback(
    (patch: CSSObject): void => {
      setConfig(
        mergeComponentRoot({ theme: configRef.current }, 'MuiCard', patch)
      )
    },
    [setConfig]
  )

  const updateButtonComponent = useCallback(
    (patch: CSSObject): void => {
      setConfig(
        mergeComponentRoot({ theme: configRef.current }, 'MuiButton', patch)
      )
    },
    [setConfig]
  )

  const onWidgetRadiusChange = useCallback(
    (n: number) => updateContainer({ borderRadius: `${n}px` }),
    [updateContainer]
  )

  return useMemo(() => {
    const container = themeSnapshot?.container ?? {}
    const shape = themeSnapshot?.shape ?? {}
    const cardRootObj = extractCssObject(
      themeSnapshot?.components?.MuiCard?.styleOverrides?.root
    )
    const buttonRootObj = extractCssObject(
      themeSnapshot?.components?.MuiButton?.styleOverrides?.root
    )

    const widgetShadow = parseShadowState(
      container.boxShadow,
      WIDGET_SHADOW_DEFAULTS
    )
    const widgetBorder = parseCssBorder(container.border as string | undefined)

    const cardBorder = parseCardBorderState(
      cardRootObj,
      themeSnapshot?.components?.MuiCard,
      effectivePaletteMode,
      themeSnapshot?.colorSchemes?.light?.palette?.grey?.[300],
      themeSnapshot?.colorSchemes?.dark?.palette?.grey?.[800]
    )
    const cardShadow = parseShadowState(
      cardRootObj.boxShadow,
      COMPONENT_SHADOW_DEFAULTS
    )

    const buttonShadow = parseShadowState(
      buttonRootObj.boxShadow,
      COMPONENT_SHADOW_DEFAULTS
    )
    const buttonBorder = parseCssBorder(
      buttonRootObj.border as string | undefined
    )

    const widgetHandlers = buildSurfaceHandlers(
      widgetShadow,
      widgetBorder,
      updateContainer,
      undefined
    )
    const cardHandlers = buildSurfaceHandlers(
      cardShadow,
      cardBorder,
      updateCardComponent
    )
    const buttonHandlers = buildSurfaceHandlers(
      buttonShadow,
      buttonBorder,
      updateButtonComponent
    )

    return {
      widget: {
        title: 'Widget',
        radius: pxFromCss(container.borderRadius, 16),
        onRadiusChange: onWidgetRadiusChange,
        radiusMax: 32,
        ...widgetHandlers,
      },
      card: {
        title: 'Card',
        radius: shape.borderRadius ?? 8,
        onRadiusChange: setBorderRadius,
        radiusMax: 24,
        ...cardHandlers,
      },
      button: {
        title: 'Button',
        radius: shape.borderRadiusSecondary ?? 8,
        onRadiusChange: setBorderRadiusSecondary,
        radiusMax: 24,
        ...buttonHandlers,
      },
    }
  }, [
    effectivePaletteMode,
    onWidgetRadiusChange,
    setBorderRadius,
    setBorderRadiusSecondary,
    themeSnapshot,
    updateCardComponent,
    updateContainer,
    updateButtonComponent,
  ])
}
