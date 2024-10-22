import type { WidgetTheme, WidgetThemeComponents } from '../types/widget.js'

type ComponentName = keyof WidgetThemeComponents

export const getStyleOverrides = (
  componentName: ComponentName,
  styleOverrideProp: string,
  theme: WidgetTheme,
  ownerState?: any
) => {
  const component = theme.components?.[componentName]
  const property = (component?.styleOverrides as any)?.[styleOverrideProp]

  if (typeof property === 'function') {
    return property({ theme, ownerState })
  }
  return property
}
