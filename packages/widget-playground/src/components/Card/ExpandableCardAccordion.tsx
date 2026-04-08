import type { JSX } from 'react'
import {
  type Context,
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useState,
} from 'react'

export const ExpandableCardAccordionContext: Context<{
  setOpenCard: Dispatch<SetStateAction<string>>
  openCard: string
}> = createContext<{
  setOpenCard: Dispatch<SetStateAction<string>>
  openCard: string
}>({
  setOpenCard: () => {},
  openCard: '',
})

export const ExpandableCardAccordion = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const [openCard, setOpenCard] = useState('')

  return (
    <ExpandableCardAccordionContext.Provider value={{ openCard, setOpenCard }}>
      {children}
    </ExpandableCardAccordionContext.Provider>
  )
}
