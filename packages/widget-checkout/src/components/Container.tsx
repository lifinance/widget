import type { PropsWithChildren } from 'react'
import {
  CssBaselineContainer,
  FlexContainer,
  RelativeContainer,
} from './Container.style.js'

export { ExpandedContainer } from './Container.style.js'

export const Container: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <RelativeContainer>
      <CssBaselineContainer enableColorScheme>
        <FlexContainer disableGutters>{children}</FlexContainer>
      </CssBaselineContainer>
    </RelativeContainer>
  )
}
