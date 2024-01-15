import { ChainType } from '@lifi/sdk';
import { ConnectionContext } from '@solana/wallet-adapter-react';
import { useContext, type FC, type PropsWithChildren } from 'react';
import { isItemAllowed } from '../../utils';
import { useWidgetConfig } from '../WidgetProvider';
import { SVMBaseProvider } from './SVMBaseProvider';
import { SVMExternalContext } from './SVMExternalContext';

export function useInSolanaContext(): boolean {
  const { chains } = useWidgetConfig();
  const context = useContext(ConnectionContext);
  return (
    Boolean(context?.connection) || !isItemAllowed(ChainType.SVM, chains?.types)
  );
}

export const SVMProvider: FC<PropsWithChildren> = ({ children }) => {
  const inSolanaContext = useInSolanaContext();

  return inSolanaContext ? (
    <SVMExternalContext.Provider value={inSolanaContext}>
      {children}
    </SVMExternalContext.Provider>
  ) : (
    <SVMBaseProvider>{children}</SVMBaseProvider>
  );
};
