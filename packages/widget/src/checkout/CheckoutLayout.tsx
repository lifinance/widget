import { useWidgetConfig } from '../providers/WidgetProvider/WidgetProvider.js'
import { createElementId, ElementId } from '../utils/elements.js'
import { Container, ExpandedContainer } from './components/Container.js'
import { Header } from './components/Header.js'
import { OnRampFlowOutlet } from './components/OnRampFlowOutlet.js'

export const CheckoutLayout: React.FC = () => {
  const { elementId } = useWidgetConfig()

  return (
    <ExpandedContainer
      id={createElementId(ElementId.AppExpandedContainer, elementId)}
    >
      <Container>
        <Header />
        <OnRampFlowOutlet />
      </Container>
    </ExpandedContainer>
  )
}
