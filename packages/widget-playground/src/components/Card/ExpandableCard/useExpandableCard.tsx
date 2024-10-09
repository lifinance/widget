import { useContext, useEffect, useId, useState } from 'react'
import { ExpandableCardAccordionContext } from './ExpandableCardAccordion'

export const useExpandableCard = () => {
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
    expanded,
    toggleExpanded,
  }
}
