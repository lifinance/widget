import { useCallback, useLayoutEffect, useState } from 'react'
import { ElementId } from '../utils/elements.js'
import { useDefaultElementId } from './useDefaultElementId.js'
import { useElementContainer } from './useElementContainer.js'

export const useGetScrollableContainer = () => {
  const elementId = useDefaultElementId()
  const scrollableContainer = useElementContainer(
    ElementId.ScrollableContainer,
    elementId
  )
  const getContainer = useCallback(
    () => scrollableContainer,
    [scrollableContainer]
  )

  return getContainer
}

export const useScrollableContainer = (elementId: string) => {
  const scrollableContainer = useElementContainer(
    ElementId.ScrollableContainer,
    elementId
  )
  const [containerElement, setContainerElement] = useState(
    () => scrollableContainer
  )

  useLayoutEffect(() => {
    if (!containerElement) {
      setContainerElement(scrollableContainer)
    }
  }, [containerElement, scrollableContainer])

  return containerElement
}

export const useScrollableOverflowHidden = () => {
  const elementId = useDefaultElementId()
  const scrollableContainer = useElementContainer(
    ElementId.ScrollableContainer,
    elementId
  )
  useLayoutEffect(() => {
    const element = scrollableContainer
    if (element) {
      element.style.overflowY = 'hidden'
    }
    return () => {
      if (element) {
        element.style.overflowY = 'auto'
      }
    }
  }, [scrollableContainer])
}
