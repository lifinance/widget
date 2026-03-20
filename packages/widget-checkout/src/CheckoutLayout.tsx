import { Outlet } from '@tanstack/react-router'
import {
  CheckoutContainer,
  CheckoutExpandedContainer,
} from './components/CheckoutContainer.js'
import { CheckoutHeader } from './components/CheckoutHeader.js'

export const CheckoutLayout: React.FC = () => {
  return (
    <CheckoutExpandedContainer>
      <CheckoutContainer>
        <CheckoutHeader title="Deposit" />
        <Outlet />
      </CheckoutContainer>
    </CheckoutExpandedContainer>
  )
}
