import type { FC, PropsWithChildren } from 'react'
import { WalletProvider } from './WalletProvider'

interface ExternalWalletProviderProps extends PropsWithChildren {
  isExternalProvider?: boolean
}
export const ExternalWalletProvider: FC<ExternalWalletProviderProps> = ({
  children,
  isExternalProvider,
}) => {
  return isExternalProvider ? (
    <WalletProvider>{children}</WalletProvider>
  ) : (
    children
  )
}
