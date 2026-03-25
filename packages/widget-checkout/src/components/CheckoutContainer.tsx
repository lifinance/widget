import type { PropsWithChildren } from 'react'
import {
  CheckoutRelativeContainer,
  CssBaselineContainer,
  FlexContainer,
} from './CheckoutContainer.style.js'

export { CheckoutExpandedContainer } from './CheckoutContainer.style.js'

export const CheckoutContainer: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <CheckoutRelativeContainer>
      <CssBaselineContainer enableColorScheme>
        <FlexContainer disableGutters>{children}</FlexContainer>
      </CssBaselineContainer>
    </CheckoutRelativeContainer>
  )
}
