import type { WidgetVariant } from '@lifi/widget'
import type { CSSProperties } from 'react'

interface VariantOptionConfig {
  id: WidgetVariant
  title: string
  description: string
}

export const VARIANT_OPTIONS: VariantOptionConfig[] = [
  {
    id: 'wide',
    title: 'Wide',
    description:
      'Information details can open in a dedicated side panel next to the main form.',
  },
  {
    id: 'compact',
    title: 'Compact',
    description: 'Information details appear stacked within a single column.',
  },
  {
    id: 'drawer',
    title: 'Drawer',
    description:
      'Widget opens as a slide-out drawer anchored to the side of the viewport.',
  },
  {
    id: 'jumper',
    title: 'Jumper',
    description:
      'Adds a Simple / Advanced rail next to the widget for switching tab sets.',
  },
]

/** Sidebar nav label for the selected variant; `default` falls back to Compact. */
export const getVariantLabel = (variant: WidgetVariant | 'default'): string =>
  VARIANT_OPTIONS.find((option) => option.id === variant)?.title ?? 'Compact'

/** Applies variant-specific container height/display overrides when switching variant. */
export const getContainerConfigForVariant = (
  variant: WidgetVariant,
  baseContainer: CSSProperties
): CSSProperties =>
  variant === 'drawer'
    ? {
        ...baseContainer,
        maxHeight: undefined,
        display: undefined,
        height: '100%',
      }
    : {
        ...baseContainer,
        display: undefined,
        height: undefined,
      }
