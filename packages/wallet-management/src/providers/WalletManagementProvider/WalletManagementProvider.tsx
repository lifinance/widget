import { WalletMenuProvider } from '../WalletMenuProvider/WalletMenuProvider.js'
import {
  WalletManagementContext,
  initialContext,
} from './WalletManagementContext.js'
import type { WalletManagementProviderProps } from './types.js'

export const WalletManagementProvider: React.FC<
  React.PropsWithChildren<WalletManagementProviderProps>
> = ({ children, config = initialContext }) => {
  return (
    <WalletManagementContext.Provider value={config}>
      <WalletMenuProvider>{children}</WalletMenuProvider>
    </WalletManagementContext.Provider>
  )
}
