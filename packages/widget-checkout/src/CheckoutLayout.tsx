import {
  createElementId,
  ElementId,
  useWidgetConfig,
} from '@lifi/widget/shared'
import { Outlet } from '@tanstack/react-router'
import { CheckoutSimulationPanel } from './components/CheckoutSimulationPanel/CheckoutSimulationPanel.js'
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
      <CheckoutSimulationPanel />
    </ExpandedContainer>
  )
}
