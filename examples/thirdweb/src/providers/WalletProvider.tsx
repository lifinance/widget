import type { FC, PropsWithChildren } from 'react'
import { ThirdwebProvider } from 'thirdweb/react'

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  return <ThirdwebProvider>{children}</ThirdwebProvider>
}
