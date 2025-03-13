# LI.FI Widget + Privy + Ethers Example
This project shows an example of how to use the LI.FI Widget with the Privy wallet and ethers library.

## Requirements
1. [A Privy app ID and client ID]('https://dashboard.privy.io')

## Installation
1. Clone this repo
2. Install dependencies `pnpm install`

## Configuration
Copy and rename `.env.example` to `.env`, and update the environment variables with yours.

## Run
Start the app by running `pnpm dev`

## Using chains from LI.FI
This example fetches a list of chains from LI.FI using the `useAvailableChains` hook, and they are passed to the Privy provider.

## Privy wallet model
On sign up, first Privy automatically creates an embedded EVM wallet, which is auto available to the widget via wagmi.

Multiple external wallets can be added by using the `useConnectWallet` hook.

## Syncing connectors and adapters
### EVM
The widget uses the wagmi library to interact with wallets, Privy supports wagmi with an Adapter, and we keep both libraries in sync by calling the 
`useSyncWagmiConfig` in the `WalletProvider`

In the case that there are multiple EVM wallets for a user, we can set the active wallet by using the privy wagmi hook `useSetActiveWallet`.

Since the wagmi configs are in sync, the widget would automatically be set to the new active wallet.

### Ethers
Since LI.FI Widget and Privy are tightly coupled with Wagmi. 

We recommended setting them up with Wagmi, and converting the Wagmi client to an ethers provider or signer which you can consume using the `useEthersProvider` and `useEthersSigner` hooks.

### Solana
We sync the solana connections by listening for connection events in the `SolanaProvider`, and emitting those events when the Privy network connected or disconnected from solana.
