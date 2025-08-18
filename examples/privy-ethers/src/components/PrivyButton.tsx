import { usePrivy } from '@privy-io/react-auth'
import { AccountButton } from './AccountButton.js'
import { ConnectButton } from './ConnectButton.js'

export function PrivyButton() {
  const { ready, authenticated } = usePrivy()

  if (!authenticated) {
    return <ConnectButton />
  }
  if (ready && authenticated) {
    return <AccountButton />
  }
}
