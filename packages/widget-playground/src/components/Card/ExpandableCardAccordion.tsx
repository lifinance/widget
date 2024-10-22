import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { createContext, useState } from 'react'

export const ExpandableCardAccordionContext = createContext<{
  setOpenCard: Dispatch<SetStateAction<string>>
  openCard: string
}>({
  setOpenCard: () => {},
  openCard: '',
})

export const ExpandableCardAccordion = ({ children }: PropsWithChildren) => {
  const [openCard, setOpenCard] = useState('')

  return (
    <ExpandableCardAccordionContext.Provider value={{ openCard, setOpenCard }}>
      {children}
    </ExpandableCardAccordionContext.Provider>
  )
}
