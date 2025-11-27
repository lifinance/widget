import { WalletMenuProvider } from '../WalletMenuProvider/WalletMenuProvider'
import type { WalletManagementProviderProps } from './types'
import {
  initialContext,
  WalletManagementContext,
} from './WalletManagementContext'

export const WalletManagementProvider: React.FC<
  React.PropsWithChildren<WalletManagementProviderProps>
> = ({ children, config = initialContext }) => {
  return (
    <WalletManagementContext.Provider value={config}>
      <WalletMenuProvider>{children}</WalletMenuProvider>
    </WalletManagementContext.Provider>
  )
}
