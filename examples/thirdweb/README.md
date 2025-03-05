# LI.FI Widget + Thirdweb Connect Example
This project shows an example of how to use the LI.FI Widget with Thirdweb Connect SDK.

## Requirements
1. [A Thirdweb app ID]('https://thirdweb.com/') with a starter plan with credit card.


## Installation
1. Clone this repo
2. Install dependencies `pnpm install`

## Configuration
Copy and rename `.env.example` to `.env.local`, and update the environment variables with yours.

## Run
Start the app by running `pnpm dev`

## Using chains from LI.FI
This example fetches a list of chains from LI.FI using the `useAvailableChains` hook, and they are passed to the Thirdweb Connect Modal

## Syncing connectors and adapters
### EVM
The widget uses the wagmi library to interact with wallets, Thirdweb supports wagmi with an Adapter, and we keep both libraries in sync by calling the 
`useSyncWagmiConfig` in the `WalletProvider`


### Solana
Thirdweb Connect no longer supports Solana
