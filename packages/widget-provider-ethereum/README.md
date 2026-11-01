# Ethereum wallet provider

## Optional Oath Wallet entry

Oath is an iOS wallet. Consumers can opt in to a named Oath entry in the existing
wallet selector without requiring a browser extension or a WalletGuide listing:

```tsx
import { EthereumProvider } from '@lifi/widget-provider-ethereum'

const providers = [
  EthereumProvider({ walletConnect: true, oathWallet: true }),
]
```

`oathWallet` also accepts `WalletConnectParameters`, including a consumer's
`projectId` and dApp `metadata`, in the same way as `walletConnect`. Oath uses a
separate storage prefix; the generic WalletConnect entry is preserved. It is not
enabled unless requested. The playground enables it as an integration example.

For an existing Wagmi configuration, add the exported
`createOathWalletConnector({ projectId, metadata })` to that configuration's
connectors. Do not add the same connector twice.

Selecting Oath opens a QR code directly. On iOS, the dialog also offers an
explicit `oathwallet://wc?uri=...` handoff; the user must review the request in
Oath. Closing the dialog cancels the current UI attempt. Late approvals from a
cancelled attempt are disconnected and cannot replace a newer connection.

This connector uses EVM WalletConnect namespaces only. It does not add Solana,
THORChain, Bitcoin or any other protocol to this package, and does not declare
that every chain configured by a consumer is supported by Oath. The wallet must
approve the requested session and accounts. It does not enable WalletConnect
Link Mode or assert an Android, desktop or browser-extension version of Oath.

### Validation

Run the provider tests and package checks:

```sh
pnpm --filter @lifi/widget-provider-ethereum test
pnpm --filter @lifi/widget-provider-ethereum check:types
pnpm --filter @lifi/widget-provider-ethereum build
pnpm --filter @lifi/wallet-management test
```

In the Vite playground, select Connect wallet → Oath Wallet. Confirm a QR appears
without a second wallet list; Cancel and repeat. The Oath row should use the same
card and avatar dimensions as the adjacent wallets, with a QR Code tag. Confirm
the generic WalletConnect path remains available. On an iPhone with a compatible
Oath build, separately verify the app handoff, session approval, supported-chain
accounts, rejection and disconnect. Desktop browser checks and mocked protocol
tests do not establish physical-device pairing or transaction signing.

This change is for the public LI.FI widget. It does not update Jumper's private
production frontend or imply that Jumper has approved a listing.
