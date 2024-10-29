import type { FC, PropsWithChildren } from 'react'
import { EVMProvider } from './EVMProvider'

interface ExternalWalletProviderProps extends PropsWithChildren {
  isExternalProvider?: boolean
}
export const ExternalWalletProvider: FC<ExternalWalletProviderProps> = ({
  children,
  isExternalProvider,
}) => {
  return isExternalProvider ? <EVMProvider>{children}</EVMProvider> : children
}
