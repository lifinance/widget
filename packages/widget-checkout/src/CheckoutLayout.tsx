import {
  createElementId,
  ElementId,
  useWidgetConfig,
} from '@lifi/widget/shared'
import { Outlet } from '@tanstack/react-router'
import { CheckoutToastHost } from './components/CheckoutToastHost.js'
import { Container, ExpandedContainer } from './components/Container.js'
import { Header } from './components/Header.js'
import { OnRampHostedModals } from './components/OnRampHostedModals.js'
import { useSyncCheckoutRecipientToForm } from './hooks/useSyncCheckoutRecipientToForm.js'

export const CheckoutLayout: React.FC = () => {
  const { elementId } = useWidgetConfig()
  useSyncCheckoutRecipientToForm()

  return (
    <ExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
    >
      <Container>
        <Header />
        <Outlet />
      </Container>
      <OnRampHostedModals />
      <CheckoutToastHost />
    </ExpandedContainer>
  )
}
