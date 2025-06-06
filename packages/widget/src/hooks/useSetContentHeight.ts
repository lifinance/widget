import type { RefObject } from 'react'
import { useLayoutEffect } from 'react'
import { getRelativeContainer } from '../utils/elements.js'
import { useDefaultElementId } from './useDefaultElementId.js'

// NOTE: this hook is implicitly tied to the widget height functionality in the
//   AppExpandedContainer, RelativeContainer and CssBaselineContainer components as defined in AppContainer.ts
//   CSS changes in those components can have implications for the functionality in this hook

export const useSetContentHeight = (
  ref: RefObject<HTMLElement | null>,
  dependency?: unknown
) => {
  const elementId = useDefaultElementId()
  // biome-ignore lint/correctness/useExhaustiveDependencies: we use dependency to refresh height
  useLayoutEffect(() => {
    const relativeContainer = getRelativeContainer(elementId)
    if (
      !relativeContainer ||
      !ref.current ||
      ref.current?.clientHeight <= relativeContainer?.clientHeight
    ) {
      return
    }
    relativeContainer.style.minHeight = `${ref.current.clientHeight}px`
    return () => {
      relativeContainer.style.removeProperty('min-height')
    }
  }, [elementId, ref, dependency])
}
