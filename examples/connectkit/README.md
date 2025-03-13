# LI.FI Widget + Connectkit Example
This project shows an example of how to use the LI.FI Widget with the Connectkit wallet from Family.

## Requirements
1. [A Walletconnect (Reown) app ID]('https://cloud.reown.com/app')

## Installation
1. Clone this repo
2. Install dependencies `pnpm install`

## Configuration
Copy and rename `.env.example` to `.env.local`, and update the environment variables with yours.

## Run
Start the app by running `pnpm dev`

## Using chains from LI.FI
This example fetches a list of chains from LI.FI using the `useAvailableChains` hook, and they are passed to the Connectkit modal.

## Syncing connectors and adapters
### EVM
The widget uses the wagmi library to interact with wallets, Connectkit supports wagmi with an Adapter, and we keep both libraries in sync by calling the 
`useSyncWagmiConfig` in the `WalletProvider`

### Solana
Connectkit is an EVM only wallet provider at this point.
