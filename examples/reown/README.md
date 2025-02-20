# LI.FI widget + AppKit Example
This project shows an example of how to use the LI.FI widget with the AppKit from Reown

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

## Your App

## React + TypeScript + Vite
This example was setup with the React + Typescript + Vite template.

The template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
