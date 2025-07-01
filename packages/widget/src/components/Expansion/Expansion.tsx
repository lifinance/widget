import { useEffect, useState } from 'react'
import { useHasChainExpansion } from '../../hooks/useHasChainExpansion'
import { RoutesExpanded } from '../Routes/RoutesExpanded'
import { routesExpansionWidth } from '../Routes/RoutesExpanded.style'
import { ChainsExpansion } from './ChainsExpansion'
import { chainExpansionWidth } from './ChainsExpansion.style'
import { ExpansionBox } from './Expansion.style'
import { ExpansionSlideWrapper } from './ExpansionSlide.style'

export const Expansion = () => {
  const [routesOpen, setRoutesOpen] = useState(false)
  const chainsOpen = useHasChainExpansion()
  const [nextWidth, setNextWidth] = useState('0px')

  useEffect(() => {
    if (routesOpen) {
      setNextWidth(routesExpansionWidth)
    } else if (chainsOpen) {
      setNextWidth(chainExpansionWidth)
    } else {
      setNextWidth('0px')
    }
  }, [chainsOpen, routesOpen])

  return (
    <ExpansionBox>
      <ExpansionSlideWrapper expansionWidth={nextWidth}>
        <RoutesExpanded setOpenExpansion={setRoutesOpen} />
        <ChainsExpansion />
      </ExpansionSlideWrapper>
    </ExpansionBox>
  )
}
