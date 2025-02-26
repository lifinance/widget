# LI.FI widget + Privy Example
This project shows an example of how to use the LI.FI widget with the Privy wallet.

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

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
