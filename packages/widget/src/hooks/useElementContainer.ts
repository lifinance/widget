import { useShadowRoot } from '../providers/ShadowRootProvider'
import { createElementId, type ElementId } from '../utils/elements'

export const useElementContainer = (
  containerId: ElementId,
  elementId: string
) => {
  const shadowRoot = useShadowRoot()
  // Note: Elements in shadowRoot are NOT accessible via document.getElementById()
  // and vice versa. The widget is rendered either in shadowRoot OR document,
  // so we search the appropriate scope based on which one exists.
  return (shadowRoot || document)?.getElementById(
    createElementId(containerId, elementId)
  )
}
