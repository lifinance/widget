# LI.FI Widget + Dynamic Example
This project shows an example of how to use the LI.FI Widget with the Dynamic wallet

## Requirements
1. [An Environment ID]('https://app.dynamic.xyz/dashboard/developer')

## Installation
1. Clone this repo
2. Install dependencies `pnpm install`

## Configuration
Update the `environment-id` prop on `<DynamicContextProvider />` with yours

## Run
Start the app by running `pnpm dev`

## Using chains from LI.FI
This example fetches a list of chains from LI.FI using the `useAvailableChains` hook, and they are passed to the Dynamic component.

## Syncing connectors and adapters
### EVM
The widget uses the wagmi library to interact with wallets, Dynamic supports the wagmi connecter, and we keep both libraries in sync by calling the 
`useSyncWagmiConfig` in the `WalletProvider`

### Solana
The widget uses the solana library to manage solana wallets. We use a hook from dynamic to watch for the active solana wallet, and connect or disconnect.

### Embedded Solana Wallets
The Dynamic embedded solana wallet is a wrapper around [TurnKey Solana Wallet](https://github.com/tkhq/sdk/tree/main/packages/solana), and both libraries doesn't have adapters that implement the [solana wallet standard](https://github.com/anza-xyz/wallet-adapter/blob/master/WALLET.md). 

This example in `./src/adapters/dynamic` implements an Adapter based on the standard for the Dynamic Embedded solana (Turnkey) wallet.
After the adapter in initialized, the Solana Provider automatically works with the embedded wallet. 

