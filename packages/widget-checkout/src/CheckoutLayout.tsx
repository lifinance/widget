import {
  createElementId,
  ElementId,
  useWidgetConfig,
} from '@lifi/widget/shared'
import { Outlet } from '@tanstack/react-router'
import { Container, ExpandedContainer } from './components/Container.js'
import { Header } from './components/Header.js'
import { OnRampHostedModals } from './components/OnRampHostedModals.js'

export const CheckoutLayout: React.FC = () => {
  const { elementId } = useWidgetConfig()

  return (
    <ExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
    >
      <Container>
        <Header />
        <Outlet />
      </Container>
      <OnRampHostedModals />
    </ExpandedContainer>
  )
}
