import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useId, useState } from 'react';

const SettingsAccordionContext = createContext({
  setOpenCard: (id: string) => {},
  openCard: '',
});

export const SettingsCardAccordion: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [openCard, setOpenCard] = useState('');

  return (
    <SettingsAccordionContext.Provider value={{ openCard, setOpenCard }}>
      {children}
    </SettingsAccordionContext.Provider>
  );
};

export const useSettingsCardExpandable = () => {
  const settingCardExpandableId = useId();
  const [expanded, setExpanded] = useState(false);
  const { openCard, setOpenCard } = useContext(SettingsAccordionContext);
  const toggleExpanded = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);

    if (newExpanded && openCard !== settingCardExpandableId) {
      setOpenCard(settingCardExpandableId);
    }
  };

  useEffect(() => {
    if (openCard !== settingCardExpandableId) {
      setExpanded(false);
    }
  }, [settingCardExpandableId, openCard]);

  return {
    expanded,
    toggleExpanded,
  };
};
