# LI.FI Widget + Rainbowkit Example
This project shows an example of how to use the LI.FI Widget with the Rainbowkit.

## Requirements
1. [A WALLET CONNECT ID]('https://cloud.reown.com/app')

## Installation
1. Clone this repo
2. Install dependencies `pnpm install`

## Configuration 
Update `.env` with your variables.

## Run
Start the app by running `pnpm dev`

## Using chains from LI.FI
This example fetches a list of chains from LI.FI using the `useAvailableChains` hook, and they are passed to the wagmi config.

## Syncing connectors and adapters
### EVM
The widget and Rainbowkit both use the wagmi library to interact with wallets, and we keep both instances in sync by calling the 
`useSyncWagmiConfig` in the `WalletProvider`
