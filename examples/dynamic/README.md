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
We sync the solana connections by listening for connection events in the `SolanaProvider`, and emitting those events when the Dynamic wallet is connected or disconnected from solana.
