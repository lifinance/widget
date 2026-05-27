import { useCallback, useLayoutEffect, useState } from 'react'
import { getScrollableContainer } from '../utils/elements.js'
import { useDefaultElementId } from './useDefaultElementId.js'

export const useGetScrollableContainer = (): (() => HTMLElement | null) => {
  const elementId = useDefaultElementId() ?? ''
  const getContainer = useCallback(
    () => getScrollableContainer(elementId),
    [elementId]
  )

  return getContainer
}

export const useScrollableContainer = (
  elementId: string
): HTMLElement | null => {
  const [containerElement, setContainerElement] = useState(() =>
    getScrollableContainer(elementId)
  )

  useLayoutEffect(() => {
    if (!containerElement) {
      setContainerElement(getScrollableContainer(elementId))
    }
  }, [containerElement, elementId])

  return containerElement
}
