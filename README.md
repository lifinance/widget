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

- All ecosystems, chains, bridges, exchanges, and solvers that [LI.FI](https://docs.li.fi/introduction/chains) supports
- Embeddable variants - compact, wide, and drawer
- Options to allow or deny certain chains, tokens, bridges, and exchanges
- Pre-configured themes and lots of customization options with dark mode support so you can match the look and feel of your web app 
- Wallet management UI with the option to opt-out and use your own ([Wagmi](https://wagmi.sh/), [Bigmi](https://github.com/lifinance/bigmi) and [Wallet Standard](https://github.com/wallet-standard/wallet-standard) support)
- Supports widely adopted industry standards, including [EIP-5792](https://eips.ethereum.org/EIPS/eip-5792), [ERC-2612](https://eips.ethereum.org/EIPS/eip-2612), [EIP-712](https://eips.ethereum.org/EIPS/eip-712), [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963), and [Permit2](https://github.com/Uniswap/permit2)
- View of transactions in progress and transaction history
- Curated wallet lists and wallet bookmarks
- Route settings for advanced users (stored locally)
- Complete UI translations to match your customer’s preferred language
- Compatibility tested with React, Next.js, Vue, Nuxt.js, Svelte, Remix, Gatsby, Vite, RainbowKit, Reown AppKit, Privy, Dynamic

## Installation

### LI.FI Widget

LI.FI Widget is available as an [npm package](https://www.npmjs.com/package/@lifi/widget).

**pnpm:**

```sh
pnpm add @lifi/widget wagmi @bigmi/react @solana/wallet-adapter-react @tanstack/react-query @mysten/dapp-kit
```

**npm:**

```sh
npm install @lifi/widget wagmi @bigmi/react @solana/wallet-adapter-react @tanstack/react-query @mysten/dapp-kit
```

**yarn:**

```sh
yarn add @lifi/widget wagmi @bigmi/react @solana/wallet-adapter-react @tanstack/react-query @mysten/dapp-kit
```

- [Wagmi](https://wagmi.sh/) is type safe, extensible, and modular library for building Ethereum apps.
- [Bigmi](https://github.com/lifinance/bigmi) is modular TypeScript library that provides reactive primitives for building Bitcoin applications.
- [@solana/wallet-adapter-react](https://github.com/anza-xyz/wallet-adapter) is modular TypeScript wallet adapters and components for Solana applications.
- [TanStack Query](https://tanstack.com/query/v5) is an async state manager that handles requests, caching, and more.
- [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit) provides React tools for wallet integration and data access in Sui blockchain dApps.

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

## Contributing

### Adding Changesets

When making changes that affect package versions, you need to create a changeset:

1. Run `pnpm changeset` to create a new changeset file
2. Select the packages affected by your changes
3. Choose the version bump type (patch, minor, or major)
4. Write a description of your changes
5. Commit the changeset file along with your changes

Changesets accumulate in the `.changeset/` directory and can be batched together before versioning.

### Creating a Version PR

When you're ready to release (after multiple changesets have been merged to `main`):

1. Go to the [GitHub Actions](https://github.com/lifinance/widget/actions) page
2. Select the "Changesets Version" workflow
3. Click "Run workflow" button and confirm
4. This will create a "Version Packages" PR with all accumulated changesets
5. Review and merge the version PR to bump versions and update changelogs
6. After merging, create and push a git tag matching the new version (e.g., `v3.34.2`)
7. Pushing the tag will automatically trigger the publish workflow to build and publish packages to npm

This allows multiple changes to be batched into a single release version.

## Changelog

The [changelog](/CHANGELOG.md) is regularly updated to reflect what's changed in each new release.
