import { useContext, useEffect, useId, useState } from 'react'
import { ExpandableCardAccordionContext } from './ExpandableCardAccordion.js'

export const useExpandableCard = (): {
  expanded: boolean
  toggleExpanded: () => void
} => {
  const settingCardExpandableId = useId()
  const [expanded, setExpanded] = useState(false)
  const { openCard, setOpenCard } = useContext(ExpandableCardAccordionContext)
  const toggleExpanded = () => {
    const newExpanded = !expanded
    setExpanded(newExpanded)

    if (newExpanded && openCard !== settingCardExpandableId) {
      setOpenCard(settingCardExpandableId)
    }
  }

  useEffect(() => {
    if (openCard !== settingCardExpandableId) {
      setExpanded(false)
    }
  }, [settingCardExpandableId, openCard])

  return {
    expanded: expanded,
    toggleExpanded: toggleExpanded,
  }
}
