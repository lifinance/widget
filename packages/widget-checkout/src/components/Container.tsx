import {
  createElementId,
  ElementId,
  useWidgetConfig,
} from '@lifi/widget/shared'
import type { PropsWithChildren } from 'react'
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
