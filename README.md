<div align="center">

[![license](https://img.shields.io/github/license/lifinance/widget)](/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@lifi/widget/latest.svg)](https://www.npmjs.com/package/@lifi/widget)
[![npm downloads](https://img.shields.io/npm/dm/@lifi/widget.svg)](https://www.npmjs.com/package/@lifi/widget)
[![Crowdin](https://badges.crowdin.net/lifi-widget/localized.svg)](https://crowdin.com/project/lifi-widget)
[![Follow on Twitter](https://img.shields.io/twitter/follow/lifiprotocol.svg?label=follow+LI.FI)](https://twitter.com/lifiprotocol)

</div>

<h1 align="center">LI.FI Widget</h1>

![GitHub_Repo_Card](https://github.com/user-attachments/assets/fc08ab8c-d7fb-41de-b478-c1e69c631a23)

[**LI.FI Widget**](https://docs.li.fi/widget/overview) is a set of prebuilt UI components for secure cross-chain bridging and swapping. The widget can be customized to match your web app's design and helps drive your multi-chain strategy by attracting users from all ecosystems.

[**LI.FI Widget**](https://docs.li.fi/widget/overview) features include:

- **Provider-based architecture** - Modular blockchain support with separate packages for Ethereum, Bitcoin, Solana, and Sui
- All ecosystems, chains, bridges, exchanges, and solvers that [LI.FI](https://docs.li.fi/introduction/chains) supports
- Embeddable variants - compact, wide, and drawer
- Options to allow or deny certain chains, tokens, bridges, and exchanges
- Pre-configured themes and lots of customization options with dark mode support so you can match the look and feel of your web app 
- Built-in wallet management UI with support for external wallet providers ([Wagmi](https://wagmi.sh/), [Bigmi](https://github.com/lifinance/bigmi), [@solana/wallet-adapter-react](https://github.com/anza-xyz/wallet-adapter), and [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit))
- Supports widely adopted industry standards, including [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792), [ERC-2612](https://eips.ethereum.org/EIPS/eip-2612), [EIP-712](https://eips.ethereum.org/EIPS/eip-712), [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963), and [Permit2](https://github.com/Uniswap/permit2)
- View of transactions in progress and transaction history
- Curated wallet lists and wallet bookmarks
- Route settings for advanced users (stored locally)
- Complete UI translations to match your customer's preferred language
- Compatibility tested with React, Next.js, Vue, Nuxt.js, Svelte, Remix, Gatsby, Vite, RainbowKit, Reown AppKit, Privy, Dynamic

## Installation

### LI.FI Widget

LI.FI Widget is available as an [npm package](https://www.npmjs.com/package/@lifi/widget). The widget uses a provider-based architecture, allowing you to choose which blockchains to support.

**Core package:**

**pnpm:**

```sh
pnpm add @lifi/widget @tanstack/react-query
```

**npm:**

```sh
npm install @lifi/widget @tanstack/react-query
```

**yarn:**

```sh
yarn add @lifi/widget @tanstack/react-query
```

### Blockchain Providers

Install the provider packages for the blockchains you want to support:

**Ethereum/EVM chains:**

**pnpm:**

```sh
pnpm add @lifi/widget-provider-ethereum wagmi
```

**npm:**

```sh
npm install @lifi/widget-provider-ethereum wagmi
```

**yarn:**

```sh
yarn add @lifi/widget-provider-ethereum wagmi
```

**Bitcoin:**

**pnpm:**

```sh
pnpm add @lifi/widget-provider-bitcoin @bigmi/react
```

**npm:**

```sh
npm install @lifi/widget-provider-bitcoin @bigmi/react
```

**yarn:**

```sh
yarn add @lifi/widget-provider-bitcoin @bigmi/react
```

**Solana:**

**pnpm:**

```sh
pnpm add @lifi/widget-provider-solana @solana/wallet-adapter-react
```

**npm:**

```sh
npm install @lifi/widget-provider-solana @solana/wallet-adapter-react
```

**yarn:**

```sh
yarn add @lifi/widget-provider-solana @solana/wallet-adapter-react
```

**Sui:**

**pnpm:**

```sh
pnpm add @lifi/widget-provider-sui @mysten/dapp-kit
```

**npm:**

```sh
npm install @lifi/widget-provider-sui @mysten/dapp-kit
```

**yarn:**

```sh
yarn add @lifi/widget-provider-sui @mysten/dapp-kit
```

**Note:** You only need to install the provider packages for the blockchains you want to support. Each provider package includes its required peer dependencies.

### LI.FI Wallet Management

LI.FI Wallet Management is available as an [npm package](https://www.npmjs.com/package/@lifi/wallet-management) and provides wallet management UI components.

**pnpm:**

```sh
pnpm add @lifi/wallet-management
```

**npm:**

```sh
npm install @lifi/wallet-management
```

**yarn:**

```sh
yarn add @lifi/wallet-management
```

## Architecture

The LI.FI Widget uses a **provider-based architecture** that allows you to selectively enable support for different blockchains:

- **`@lifi/widget`** - Core widget package with UI components and functionality
- **`@lifi/widget-provider`** - Base provider package with shared types and utilities
- **`@lifi/widget-provider-ethereum`** - Ethereum/EVM chains support (requires [Wagmi](https://wagmi.sh/))
- **`@lifi/widget-provider-bitcoin`** - Bitcoin support (requires [Bigmi](https://github.com/lifinance/bigmi))
- **`@lifi/widget-provider-solana`** - Solana support (requires [@solana/wallet-adapter-react](https://github.com/anza-xyz/wallet-adapter))
- **`@lifi/widget-provider-sui`** - Sui support (requires [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit))
- **`@lifi/wallet-management`** - Wallet management UI components

This architecture provides:
- **Modularity**: Only install and bundle what you need
- **Flexibility**: Mix and match blockchain support
- **Extensibility**: Easy to add support for new blockchains
- **Tree-shaking**: Unused providers are automatically excluded from your bundle

## Getting started with LI.FI Widget

Here is an example of a basic app using LI.FI Widget with Ethereum support:

```tsx
import { LiFiWidget, WidgetConfig } from '@lifi/widget';
import { EthereumProvider } from '@lifi/widget-provider-ethereum';

const widgetConfig: WidgetConfig = {
  providers: [
    EthereumProvider(),
  ],
  theme: {
    container: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '16px',
    },
  },
};

export const WidgetPage = () => {
  return (
    <LiFiWidget integrator="Your dApp/company name" config={widgetConfig} />
  );
};
```

**Multi-chain example** (Ethereum, Solana, Bitcoin, and Sui):

```tsx
import { LiFiWidget, WidgetConfig } from '@lifi/widget';
import { BitcoinProvider } from '@lifi/widget-provider-bitcoin';
import { EthereumProvider } from '@lifi/widget-provider-ethereum';
import { SolanaProvider } from '@lifi/widget-provider-solana';
import { SuiProvider } from '@lifi/widget-provider-sui';

const widgetConfig: WidgetConfig = {
  providers: [
    EthereumProvider(),
    SolanaProvider(),
    BitcoinProvider(),
    SuiProvider(),
  ],
  theme: {
    container: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '16px',
    },
  },
};

export const WidgetPage = () => {
  return (
    <LiFiWidget integrator="Your dApp/company name" config={widgetConfig} />
  );
};
```

Please refer to our [documentation](https://docs.li.fi/widget/compatibility) if you encounter any issues with importing.

You can also refer to the [examples](/examples) folder in this repository to see how to import the widget in your specific context.

## Examples

Visit our [playground](https://playground.li.fi) to see how you can customize your [LI.FI Widget](https://www.npmjs.com/package/@lifi/widget) experience. Additionally, see [examples](/examples) folder in this repository.

## Documentation

Please visit [LI.FI Widget Documentation](https://docs.li.fi/widget/install-widget).

## Contributing Translations

We appreciate your interest in helping translate our project!

If you'd like to contribute translations, please visit our Crowdin project page at [Crowdin LI.FI Widget](https://crowdin.com/project/lifi-widget). Register on Crowdin and you can start translating the project into your preferred language. Your contributions will help make our project accessible to a wider audience around the world.

Thank you for your support!

## Changelog

The [changelog](/CHANGELOG.md) is regularly updated to reflect what's changed in each new release.
