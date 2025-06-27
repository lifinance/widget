import { RoutesExpanded } from '../Routes/RoutesExpanded'
import { ChainsExpansion } from './ChainsExpansion'
import { ExpansionBox } from './Expansion.style'

export const Expansion = () => {
  return (
    <ExpansionBox>
      <RoutesExpanded />
      <ChainsExpansion />
    </ExpansionBox>
  )
}
