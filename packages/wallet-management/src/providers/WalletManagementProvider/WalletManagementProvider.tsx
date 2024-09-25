import { WalletMenuProvider } from '../WalletMenuProvider/WalletMenuProvider.js';
import type { WalletManagementProviderProps } from './types.js';
import {
  initialContext,
  WalletManagementContext,
} from './WalletManagementContext.js';

export const WalletManagementProvider: React.FC<
  React.PropsWithChildren<WalletManagementProviderProps>
> = ({ children, config = initialContext }) => {
  return (
    <WalletManagementContext.Provider value={config}>
      <WalletMenuProvider>{children}</WalletMenuProvider>
    </WalletManagementContext.Provider>
  );
};
