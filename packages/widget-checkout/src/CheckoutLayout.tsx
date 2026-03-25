import { Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import {
  CheckoutContainer,
  CheckoutExpandedContainer,
} from './components/CheckoutContainer.js'
import { CheckoutHeader } from './components/CheckoutHeader.js'

export const CheckoutLayout: React.FC = () => {
  const { t } = useTranslation()
  return (
    <CheckoutExpandedContainer>
      <CheckoutContainer>
        <CheckoutHeader title={t('checkout.deposit')} />
        <Outlet />
      </CheckoutContainer>
    </CheckoutExpandedContainer>
  )
}
