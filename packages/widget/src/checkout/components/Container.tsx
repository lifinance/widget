import type { PropsWithChildren } from 'react'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { createElementId, ElementId } from '../../utils/elements.js'
import {
  CssBaselineContainer,
  FlexContainer,
  RelativeContainer,
} from './Container.style.js'

export { ExpandedContainer } from './Container.style.js'

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
  const { elementId } = useWidgetConfig()

  return (
    <RelativeContainer
      id={createElementId(ElementId.RelativeContainer, elementId)}
    >
      <CssBaselineContainer
        id={createElementId(ElementId.ScrollableContainer, elementId)}
        enableColorScheme
      >
        <FlexContainer disableGutters>{children}</FlexContainer>
      </CssBaselineContainer>
    </RelativeContainer>
  )
}
