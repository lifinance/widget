import { createContext, PropsWithChildren, useState } from 'react';

export const ExpandableCardAccordionContext = createContext({
  setOpenCard: (id: string) => {},
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
