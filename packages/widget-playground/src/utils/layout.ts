import type { WidgetVariant } from '@lifi/widget'
import type { CSSProperties } from 'react'
import type { Layout } from '../store/editTools/types.js'

export const getLayoutMode = (container?: CSSProperties): Layout => {
  if (!container) {
    return 'default'
  }

  if (container.display === 'flex' && container.height === '100%') {
    return 'full-height'
  }
  if (Number.isFinite(container.height)) {
    return 'restricted-height'
  }
  if (Number.isFinite(container.maxHeight)) {
    return 'restricted-max-height'
  }

  return 'default'
}

export const isFullHeightLayout = (container?: CSSProperties): boolean =>
  getLayoutMode(container) === 'full-height'

export const getLayoutLabel = (
  layoutId: Layout,
  isDrawerVariant: boolean
): string => {
  if (layoutId === 'default') {
    return getDefaultLayoutCopy(isDrawerVariant).title
  }

  const option = LAYOUT_OPTIONS.find(({ id }) => id === layoutId)
  return option?.title ?? getDefaultLayoutCopy(isDrawerVariant).title
}

interface LayoutOptionConfig {
  id: Layout
  title: string
  description: string
}

export const getDefaultLayoutCopy = (
  isDrawerVariant: boolean
): Pick<LayoutOptionConfig, 'title' | 'description'> => ({
  title: isDrawerVariant ? 'Default (fill viewport)' : 'Default (fit content)',
  description: isDrawerVariant
    ? 'The drawer uses the full height of the viewport.'
    : 'The widget height grows automatically with its content.',
})

export const LAYOUT_OPTIONS: LayoutOptionConfig[] = [
  {
    id: 'restricted-height',
    title: 'Restricted height',
    description:
      'Set a fixed height for the widget container. Best with compact and wide variants.',
  },
  {
    id: 'restricted-max-height',
    title: 'Restricted max height',
    description:
      'The widget grows with its content up to a maximum height. Best with compact and wide variants.',
  },
  {
    id: 'full-height',
    title: 'Full height',
    description:
      'The widget uses the full height of the container. Best with compact variant.',
  },
]

export const isLayoutOptionDisabled = (
  layoutId: Layout,
  variant: WidgetVariant | 'default',
  isDrawerVariant: boolean
): boolean => {
  if (layoutId === 'default') {
    return false
  }
  if (isDrawerVariant) {
    return true
  }
  if (layoutId === 'full-height') {
    return variant === 'wide'
  }
  return false
}

export const isRestrictedLayout = (
  layoutId: Layout
): layoutId is 'restricted-height' | 'restricted-max-height' =>
  layoutId === 'restricted-height' || layoutId === 'restricted-max-height'

export const parseHeightInput = (value: string): number | undefined => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

interface RestrictedLayoutField {
  label: string
  containerKey: 'height' | 'maxHeight'
  clearLabel: string
}

const RESTRICTED_LAYOUT_FIELDS: Record<
  'restricted-height' | 'restricted-max-height',
  RestrictedLayoutField
> = {
  'restricted-height': {
    label: 'Set height',
    containerKey: 'height',
    clearLabel: 'Clear height',
  },
  'restricted-max-height': {
    label: 'Set max height',
    containerKey: 'maxHeight',
    clearLabel: 'Clear max height',
  },
}

export const getRestrictedLayoutField = (
  layoutId: Layout
): RestrictedLayoutField | null => {
  if (!isRestrictedLayout(layoutId)) {
    return null
  }
  return RESTRICTED_LAYOUT_FIELDS[layoutId]
}
