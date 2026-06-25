import type { PropsWithChildren } from 'react'
import { createContext, use, useEffect, useId, useState } from 'react'

const SettingsAccordionContext = createContext({
  setOpenCard: (_id: string) => {},
  openCard: '',
})

export const SettingsCardAccordion: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [openCard, setOpenCard] = useState('')

  return (
    <SettingsAccordionContext value={{ openCard, setOpenCard }}>
      {children}
    </SettingsAccordionContext>
  )
}

export const useSettingsCardExpandable = (): {
  expanded: boolean
  toggleExpanded: (forceExpanded?: boolean) => void
} => {
  const settingCardExpandableId = useId()
  const [expanded, setExpanded] = useState(false)
  const { openCard, setOpenCard } = use(SettingsAccordionContext)

  const toggleExpanded = (forceExpanded?: boolean) => {
    const newExpanded = forceExpanded ?? !expanded
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
