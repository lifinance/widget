import { usePrivy } from '@privy-io/react-auth'
import { AccountBalance } from './AccountBalanceButton'
import { ConnectButton } from './ConnectButton'

export function PrivyButton() {
  const { ready, authenticated } = usePrivy()

  if (!authenticated) {
    return <ConnectButton />
  }
  if (ready && authenticated) {
    return <AccountBalance />
  }
}
