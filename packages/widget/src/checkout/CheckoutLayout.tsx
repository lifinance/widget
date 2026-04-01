import { Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Container, ExpandedContainer } from './components/Container.js'
import { Header } from './components/Header.js'

export const CheckoutLayout: React.FC = () => {
  const { t } = useTranslation()
  return (
    <ExpandedContainer>
      <Container>
        <Header title={t('checkout.deposit')} />
        <Outlet />
      </Container>
    </ExpandedContainer>
  )
}
