import type { PropsWithChildren } from 'react';
import { createContext } from 'react';

export const SettingsAccordianContext = createContext({
  setOpenCard: (id: string) => {},
  openCard: '',
});
export const SettingsAccordian: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return <>{children}</>;
};

export const useSettingsAccordian = () => {};
