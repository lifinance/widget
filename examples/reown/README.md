# LI.FI Widget + AppKit Example
This project shows an example of how to use the LI.FI Widget with the AppKit from Reown

## Requirements
1. [A Reown app ID]('https://cloud.reown.com/app')

## Installation
1. Clone this repo
2. Install dependencies `pnpm install`

## Configuration
Copy and rename `.env.example` to `.env`, and update the environment variables with yours.

## Run
Start the app by running `pnpm dev`

## Using chains from LI.FI
This example fetches a list of chains from LI.FI using the `useAvailableChains` hook, and they are passed to the AppKit modal.

## Syncing connectors and adapters
### EVM
The widget uses the wagmi library to interact with wallets, AppKit supports wagmi with an Adapter, and we keep both libraries in sync by calling the 
`useSyncWagmiConfig` in the `WalletProvider`

### Solana
We sync the solana connections by listening for connection events in the `SolanaProvider`, and emitting those events when the AppKit network connected or disconnected from solana.
