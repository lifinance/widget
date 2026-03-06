import { useConnect, useConnection, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

function shortenAddress(address?: string) {
  if (!address) {
    return ''
  }
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function WalletHeader() {
  const { address, isConnected, chain } = useConnection()
  const { mutate: connect } = useConnect()
  const { mutate: disconnect } = useDisconnect()

  return (
    <header className="header">
      <div className="header-left">
        <span className="header-title">Widget Light — Host</span>
        <span
          className={`header-hint${isConnected ? ' header-hint-hidden' : ''}`}
        >
          Connect your wallet — all widget transactions will be signed through
          your connected wallet.
        </span>
      </div>

      <div className="header-actions">
        {isConnected && (
          <div className="account-chip">
            <span className="account-address">{shortenAddress(address)}</span>
            {chain && <span className="account-chain">{chain.name}</span>}
            <button
              type="button"
              className="btn-disconnect"
              onClick={() => disconnect({})}
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="button"
          className={`btn ${isConnected ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => connect({ connector: injected() })}
        >
          {isConnected ? 'Connect Another' : 'Connect Wallet'}
        </button>
      </div>
    </header>
  )
}
