import { ChainType } from '@lifi/sdk';
import { useContext, type FC, type PropsWithChildren } from 'react';
import { WagmiContext } from 'wagmi';
import { isItemAllowed } from '../../utils/item.js';
import { useWidgetConfig } from '../WidgetProvider/WidgetProvider.js';
import { EVMBaseProvider } from './EVMBaseProvider.js';
import { EVMExternalContext } from './EVMExternalContext.js';

export function useInWagmiContext(): boolean {
  const { chains } = useWidgetConfig();
  const context = useContext(WagmiContext);

  return Boolean(context) && isItemAllowed(ChainType.EVM, chains?.types);
}

export const EVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const inWagmiContext = useInWagmiContext();

  return inWagmiContext ? (
    <EVMExternalContext.Provider value={inWagmiContext}>
      {children}
    </EVMExternalContext.Provider>
  ) : (
    <EVMBaseProvider>{children}</EVMBaseProvider>
  );
};
