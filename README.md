<div align="center">

[![license](https://img.shields.io/badge/license-Apache%202-blue)](/LICENSE.md)
[![npm latest package](https://img.shields.io/npm/v/@lifi/widget/latest.svg)](https://www.npmjs.com/package/@lifi/widget)
[![npm downloads](https://img.shields.io/npm/dm/@lifi/widget.svg)](https://www.npmjs.com/package/@lifi/widget)
[![Crowdin](https://badges.crowdin.net/lifi-widget/localized.svg)](https://crowdin.com/project/lifi-widget)
[![Follow on Twitter](https://img.shields.io/twitter/follow/lifiprotocol.svg?label=follow+LI.FI)](https://twitter.com/lifiprotocol)

</div>

<h1 align="center">LI.FI Widget</h1>

![GitHub_Repo_Card](https://github.com/lifinance/widget/assets/18644653/aff106d6-2835-478a-b1f5-60970051473f)

[**LI.FI Widget**](https://docs.li.fi/integrate-li.fi-widget/li.fi-widget-overview) is a set of prebuilt UI components that will help you integrate a secure cross-chain bridging and swapping experience that can be styled to match your web app design perfectly and helps drive your multi-chain strategy and attract new users from everywhere.

[**LI.FI Widget**](https://docs.li.fi/integrate-li.fi-widget/li.fi-widget-overview) features include:

- All ecosystems, chains, bridges, exchanges, and solvers that [LI.FI](https://docs.li.fi/list-chains-bridges-dexs-solvers) supports
- Embeddable variants - compact, wide, and drawer
- Options to allow or deny certain chains, tokens, bridges, and exchanges
- Pre-configured themes and lots of customization options with dark mode support so you can match the look and feel of your web app 
- Wallet management UI with the option to opt-out and use your own ([Wagmi](https://wagmi.sh/), [Bigmi](https://github.com/lifinance/bigmi) and [Solana Wallet Standard](https://github.com/anza-xyz/wallet-standard) support)
- View of transactions in progress and transaction history
- Curated wallet lists and wallet bookmarks
- Route settings for advanced users (stored locally)
- Complete UI translations to match your customer’s preferred language
- Compatibility tested with React, Next.js, Vue, Nuxt.js, Svelte, Remix, Gatsby, Vite, RainbowKit, Privy, Dynamic

## Installation

### LI.FI Widget

LI.FI Widget is available as an [npm package](https://www.npmjs.com/package/@lifi/widget).

**pnpm:**

```sh
pnpm add @lifi/widget wagmi @bigmi/react @solana/wallet-adapter-react @tanstack/react-query
```

**npm:**

```sh
npm install @lifi/widget wagmi @bigmi/react @solana/wallet-adapter-react @tanstack/react-query
```

**yarn:**

```sh
yarn add @lifi/widget wagmi @bigmi/react @solana/wallet-adapter-react @tanstack/react-query
```

- [Wagmi](https://wagmi.sh/) is type safe, extensible, and modular library for building Ethereum apps.
- [Bigmi](https://github.com/lifinance/bigmi) is modular TypeScript library that provides reactive primitives for building Bitcoin applications.
- [@solana/wallet-adapter-react](https://github.com/anza-xyz/wallet-adapter) is modular TypeScript wallet adapters and components for Solana applications.
- [TanStack Query](https://tanstack.com/query/v5) is an async state manager that handles requests, caching, and more.

### LI.FI Wallet Management

LI.FI Wallet Management is available as an [npm package](https://www.npmjs.com/package/@lifi/wallet-management).

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

## Getting started with LI.FI Widget

Here is an example of a basic app using LI.FI Widget:

```tsx
import { LiFiWidget, WidgetConfig } from '@lifi/widget';

const widgetConfig: WidgetConfig = {
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

## Examples

Visit our [playground](https://playground.li.fi) to see how you can customize your [LI.FI Widget](https://www.npmjs.com/package/@lifi/widget) experience. Additionally, see [examples](/examples) folder in this repository.

## Documentation

Please visit [LI.FI Widget Documentation](https://docs.li.fi/integrate-li.fi-widget/li.fi-widget-overview).

## Contributing Translations

We appreciate your interest in helping translate our project!

If you'd like to contribute translations, please visit our Crowdin project page at [Crowdin LI.FI Widget](https://crowdin.com/project/lifi-widget). Register on Crowdin and you can start translating the project into your preferred language. Your contributions will help make our project accessible to a wider audience around the world.

Thank you for your support!

## Changelog

The [changelog](/CHANGELOG.md) is regularly updated to reflect what's changed in each new release.

## License

This project is licensed under the terms of the
[Apache-2.0](/LICENSE.md).
