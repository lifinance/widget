import type { PropsWithChildren } from 'react';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

export const ExpandableCardAccordionContext = createContext<{
  setOpenCard: Dispatch<SetStateAction<string>>;
  openCard: string;
}>({
  setOpenCard: () => {},
  openCard: '',
});

export const ExpandableCardAccordion = ({ children }: PropsWithChildren) => {
  const [openCard, setOpenCard] = useState('');

  return (
    <ExpandableCardAccordionContext.Provider value={{ openCard, setOpenCard }}>
      {children}
    </ExpandableCardAccordionContext.Provider>
  );
};
