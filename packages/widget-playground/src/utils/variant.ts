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
]

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
