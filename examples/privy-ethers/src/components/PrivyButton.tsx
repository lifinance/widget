import { usePrivy } from '@privy-io/react-auth'
import { AccountButton } from './AccountButton'
import { ConnectButton } from './ConnectButton'

export function PrivyButton() {
  const { ready, authenticated } = usePrivy()

  if (!authenticated) {
    return <ConnectButton />
  }
  if (ready && authenticated) {
    return <AccountButton />
  }
}
