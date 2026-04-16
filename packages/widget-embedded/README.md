# LI.FI Widget Light — Integration Guide

LI.FI Widget Light (`@lifi/widget-light`) lets you embed the full LI.FI cross-chain swap and bridge widget into your application via an iframe, while keeping wallet connections on your side. Your users sign transactions with their existing wallet — the widget never touches browser extensions or private keys directly.

## Features

- **Iframe isolation** — the widget runs in a sandboxed iframe; your page stays in full control
- **Multi-ecosystem support** — Ethereum (EVM), Solana, Bitcoin, and Sui out of the box
- **Your wallet, your UX** — transactions are signed by wallets you already manage (wagmi, wallet-standard, bigmi, dapp-kit)
- **Zero core dependencies** — `@lifi/widget-light` ships nothing beyond React as a peer dep; chain-specific handlers are tree-shakeable subpath imports
- **Reactive configuration** — update config at any time without reloading the iframe
- **Typed event system** — subscribe to route execution, wallet, and UI events with full TypeScript support

## How It Works

```
┌─────────────────────────────────┐       ┌────────────────────────────────┐
│         YOUR APPLICATION        │       │     IFRAME (widget.li.fi)      │
│                                 │       │                                │
│  LiFiWidgetLight component      │◄─────►│  Full LI.FI Widget             │
│  + Ecosystem handlers (wagmi…)  │  post │  Receives config, sends RPC    │
│  + Event subscriptions          │  Msg  │  requests back to your wallets │
└─────────────────────────────────┘       └────────────────────────────────┘
```

1. Your app renders `<LiFiWidgetLight>` pointing at the hosted widget URL
2. The iframe sends a `READY` signal; your app responds with config + wallet state
3. When the widget needs a signature or chain switch, it sends an RPC request via `postMessage`
4. Your ecosystem handler (e.g. wagmi) executes the request and returns the result
5. Wallet state changes (account switch, network change) are pushed to the iframe automatically

## Quick Start — EVM Only (wagmi)

This is the minimal setup for EVM chains using wagmi. See [Full Multi-Ecosystem Setup](#full-multi-ecosystem-setup) for all chains.

### 1. Install

```bash
pnpm add @lifi/widget-light wagmi viem @wagmi/core @tanstack/react-query
```

### 2. Configure your wallet provider

Set up wagmi as you normally would. Widget Light reads wallet state from your existing wagmi context.

```tsx
// providers/WalletProvider.tsx
import type { FC, PropsWithChildren } from 'react'
import { createClient, http } from 'viem'
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains'
import { createConfig, WagmiProvider } from 'wagmi'
import { injected } from 'wagmi/connectors'

const config = createConfig({
  chains: [mainnet, arbitrum, optimism, base, polygon],
  connectors: [injected()],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
  multiInjectedProviderDiscovery: true,
  ssr: false,
})

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => (
  <WagmiProvider config={config}>{children}</WagmiProvider>
)
```

### 3. Set up the provider tree

```tsx
// main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { WalletProvider } from './providers/WalletProvider'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <App />
      </WalletProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
```

### 4. Render the widget

```tsx
// App.tsx
import { LiFiWidgetLight } from '@lifi/widget-light'
import type { WidgetLightConfig } from '@lifi/widget-light'
import { useEthereumIframeHandler } from '@lifi/widget-light/ethereum'
import { useMemo } from 'react'

const widgetConfig: WidgetLightConfig = {
  integrator: 'your-project-name',       // Required — identifies you in LI.FI analytics
  variant: 'wide',                        // 'compact' | 'wide' | 'drawer'
  theme: {
    container: {
      border: '1px solid rgb(234, 234, 234)',
      borderRadius: '16px',
    },
  },
  sdkConfig: {
    routeOptions: {
      maxPriceImpact: 0.4,
    },
  },
}

export function App() {
  const ethHandler = useEthereumIframeHandler()
  const handlers = useMemo(() => [ethHandler], [ethHandler])

  return (
    <LiFiWidgetLight
      config={widgetConfig}
      handlers={handlers}
      autoResize
    />
  )
}
```

That's it. The widget renders inside an iframe and all EVM transactions are signed through your wagmi-managed wallet.

## Full Multi-Ecosystem Setup

To support Solana, Bitcoin, and Sui alongside EVM, install the additional handler peer dependencies and pass all handlers to the widget.

### Install

```bash
# Core
pnpm add @lifi/widget-light @tanstack/react-query

# EVM
pnpm add wagmi viem @wagmi/core

# Solana (optional)
pnpm add @wallet-standard/base

# Bitcoin (optional)
pnpm add @bigmi/client @bigmi/react

# Sui (optional)
pnpm add @mysten/dapp-kit-react
```

### Create handlers for each ecosystem

```tsx
import { LiFiWidgetLight } from '@lifi/widget-light'
import { useEthereumIframeHandler } from '@lifi/widget-light/ethereum'
import { useSolanaIframeHandler } from '@lifi/widget-light/solana'
import { useBitcoinIframeHandler } from '@lifi/widget-light/bitcoin'
import { useSuiIframeHandler } from '@lifi/widget-light/sui'
import { useMemo, useCallback } from 'react'

export function App() {
  // EVM — reads wallet state from wagmi context automatically
  const ethHandler = useEthereumIframeHandler()

  // Solana — pass wallet state explicitly (library-agnostic)
  const solHandler = useSolanaIframeHandler({
    address: solanaAddress,       // string | undefined
    connected: solanaConnected,   // boolean
    wallet: solanaWallet,         // Wallet from @wallet-standard/base
  })

  // Bitcoin — reads from @bigmi/react context automatically
  const btcHandler = useBitcoinIframeHandler()

  // Sui — reads from @mysten/dapp-kit-react context automatically
  const suiHandler = useSuiIframeHandler()

  const handlers = useMemo(
    () => [ethHandler, solHandler, btcHandler, suiHandler],
    [ethHandler, solHandler, btcHandler, suiHandler]
  )

  return (
    <LiFiWidgetLight
      config={widgetConfig}
      handlers={handlers}
      autoResize
    />
  )
}
```

> Only include the handlers you need. If you only support EVM and Solana, pass `[ethHandler, solHandler]`. Unused ecosystem packages are fully tree-shaken.

## Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `src` | `string` | No | `'https://widget.li.fi'` | URL of the hosted widget |
| `config` | `WidgetLightConfig` | Yes | — | JSON-serializable widget configuration |
| `handlers` | `IframeEcosystemHandler[]` | No | `[]` | Ecosystem handlers for wallet/RPC bridging |
| `iframeOrigin` | `string` | No | Derived from `src` | Restrict `postMessage` to this origin |
| `autoResize` | `boolean` | No | `false` | When true, iframe height auto-adjusts to match content |
| `onConnect` | `(args?: ConnectWalletArgs) => void` | No | — | Called when the widget requests a wallet connection (external wallet management) |
| `style` | `CSSProperties` | No | — | Inline styles for the iframe element |
| `className` | `string` | No | — | CSS class for the iframe element |
| `title` | `string` | No | `'LI.FI Widget'` | Accessible title for the iframe |

## Configuration

`WidgetLightConfig` must be **JSON-serializable** — no React nodes, no callback functions, no MUI theme objects.

### Required

| Field | Type | Description |
|-------|------|-------------|
| `integrator` | `string` | Your project identifier for LI.FI analytics |

### Common Options

```ts
const config: WidgetLightConfig = {
  integrator: 'your-project-name',

  // Layout
  variant: 'wide',                    // 'compact' | 'wide' | 'drawer'
  subvariant: 'default',              // 'default' | 'split' | 'custom' | 'refuel'
  appearance: 'light',                // 'light' | 'dark' | 'system'

  // Pre-fill form
  fromChain: 1,                       // Source chain ID
  toChain: 42161,                     // Destination chain ID
  fromToken: '0x...',                 // Source token address
  toToken: '0x...',                   // Destination token address
  fromAmount: '10',                   // Pre-filled amount

  // Theming (CSS properties only — no MUI)
  theme: {
    container: {
      border: '1px solid #eaeaea',
      borderRadius: '16px',
    },
  },

  // API and routing
  apiKey: 'your-api-key',
  fee: 0.03,                          // Integrator fee (0-1)
  sdkConfig: {
    routeOptions: {
      maxPriceImpact: 0.4,
    },
  },

  // Filter chains, bridges, exchanges
  chains: {
    allow: [1, 137, 42161],           // Only show these chains
  },
  bridges: {
    deny: ['stargate'],               // Hide specific bridges
  },

  // UI controls
  hiddenUI: ['appearance', 'language'],
  disabledUI: ['toAddress'],
  requiredUI: ['toAddress'],
}
```

### Reactive Config Updates

Configuration is reactive. When you pass a new `config` object, the widget updates without reloading the iframe.

```tsx
const [variant, setVariant] = useState<'wide' | 'compact'>('wide')

const widgetConfig = useMemo(
  () => ({ ...baseConfig, variant }),
  [variant]
)

// Changing `variant` state updates the widget in real-time
<LiFiWidgetLight config={widgetConfig} ... />
```

## External Wallet Management

If your app has its own wallet connection UI, pass `onConnect` to handle wallet connection requests from the widget. The widget will call your handler instead of opening its built-in wallet menu.

```tsx
import type { ConnectWalletArgs } from '@lifi/widget-light'

function App() {
  const handleConnect = useCallback((args?: ConnectWalletArgs) => {
    // Open your wallet modal/dialog
    openYourWalletModal()
  }, [])

  return (
    <LiFiWidgetLight
      onConnect={handleConnect}
      // ...other props
    />
  )
}
```

## Events

Subscribe to widget events from any component using the `useWidgetLightEvents` hook. No provider wrapping required — the event bus is a module-level singleton.

```tsx
import {
  useWidgetLightEvents,
  WidgetLightEvent,
  type WidgetLightRouteExecutionUpdate,
} from '@lifi/widget-light'
import { useEffect } from 'react'

function TransactionTracker() {
  const events = useWidgetLightEvents()

  useEffect(() => {
    const onComplete = (data: WidgetLightRouteExecutionUpdate) => {
      console.log('Route completed:', data)
    }
    events.on(WidgetLightEvent.RouteExecutionCompleted, onComplete)
    return () => events.off(WidgetLightEvent.RouteExecutionCompleted, onComplete)
  }, [events])

  return null
}
```

### Available Events

| Event | Payload Type | Description |
|-------|-------------|-------------|
| `RouteExecutionStarted` | `WidgetLightRouteExecutionUpdate` | A route has started executing |
| `RouteExecutionUpdated` | `WidgetLightRouteExecutionUpdate` | Step progress update |
| `RouteExecutionCompleted` | `WidgetLightRouteExecutionUpdate` | Route completed successfully |
| `RouteExecutionFailed` | `WidgetLightRouteExecutionUpdate` | Route execution failed |
| `RouteSelected` | `WidgetLightRouteSelected` | User selected a route |
| `RouteHighValueLoss` | `WidgetLightRouteHighValueLoss` | High value loss detected |
| `SourceChainTokenSelected` | `WidgetLightChainTokenSelected` | Source token changed |
| `DestinationChainTokenSelected` | `WidgetLightChainTokenSelected` | Destination token changed |
| `FormFieldChanged` | `WidgetLightFormFieldChanged` | Any form field changed |
| `WalletConnected` | `WidgetLightWalletConnected` | Wallet connected |
| `WalletDisconnected` | `WidgetLightWalletDisconnected` | Wallet disconnected |
| `ContactSupport` | `WidgetLightContactSupport` | User clicked contact support |
| `AvailableRoutes` | — | Routes fetched and available |
| `PageEntered` | — | Page navigation |
| `WidgetExpanded` | — | Widget expanded (drawer variant) |
| `SendToWalletToggled` | — | Send-to-wallet toggle changed |
| `SettingUpdated` | `WidgetLightSettingUpdated` | User changed a setting |
| `ChainPinned` | `WidgetLightChainPinned` | Chain pinned/unpinned |
| `TokenSearch` | `WidgetLightTokenSearch` | User searched for a token |
| `LowAddressActivityConfirmed` | `WidgetLightLowAddressActivityConfirmed` | Low activity address confirmed |

## Ecosystem Handler Reference

Each handler implements the `IframeEcosystemHandler` interface and bridges RPC calls between the iframe and your wallet provider.

### EVM — `useEthereumIframeHandler()`

```tsx
import { useEthereumIframeHandler } from '@lifi/widget-light/ethereum'
```

- **Reads from:** wagmi context (`useConnection`, `useWalletClient`, `usePublicClient`, `useSwitchChain`)
- **Peer deps:** `wagmi`, `viem`, `@wagmi/core`
- **RPC methods handled:** `eth_accounts`, `eth_requestAccounts`, `eth_chainId`, `eth_sendTransaction`, `personal_sign`, `eth_signTypedData_v4`, `wallet_switchEthereumChain`, `wallet_addEthereumChain`, `wallet_sendCalls`, `wallet_getCallsStatus`, `wallet_getCapabilities`, and more
- **No parameters** — all state is read from wagmi hooks

### Solana — `useSolanaIframeHandler(params)`

```tsx
import { useSolanaIframeHandler } from '@lifi/widget-light/solana'
```

- **Peer deps:** `@wallet-standard/base`
- **Parameters:**
  - `address: string | undefined` — connected wallet address
  - `connected: boolean` — whether a wallet is connected
  - `wallet: Wallet | undefined` — wallet-standard `Wallet` instance
- **RPC methods:** `getAccount`, `signTransaction`, `signMessage`, `signAndSendTransaction`
- **Library-agnostic** — works with any Solana wallet adapter that provides a wallet-standard `Wallet`

### Bitcoin — `useBitcoinIframeHandler()`

```tsx
import { useBitcoinIframeHandler } from '@lifi/widget-light/bitcoin'
```

- **Reads from:** `@bigmi/react` context (`useAccount`, `useConfig`)
- **Peer deps:** `@bigmi/client`, `@bigmi/react`
- **No parameters**

### Sui — `useSuiIframeHandler()`

```tsx
import { useSuiIframeHandler } from '@lifi/widget-light/sui'
```

- **Reads from:** `@mysten/dapp-kit-react` hooks
- **Peer deps:** `@mysten/dapp-kit-react`
- **RPC methods:** `getAccount`, `signTransaction`, `signPersonalMessage`, `signAndExecuteTransaction`
- **No parameters**

## Security

`iframeOrigin` is automatically derived from `src` (defaults to `https://widget.li.fi`), so `postMessage` communication is restricted to the correct origin out of the box. If you use a custom `src`, `iframeOrigin` will be derived from it automatically. You only need to set `iframeOrigin` explicitly if you want to override the derived value.

## Examples

Working examples are available in the repository:

| Example | Description | Path |
|---------|-------------|------|
| **vite-iframe-wagmi** | Minimal EVM-only integration | `examples/vite-iframe-wagmi/` |
| **vite-iframe** | Full multi-ecosystem with events, config reactivity, and external wallet management | `examples/vite-iframe/` |

Run an example locally:

```bash
# From the repository root
pnpm install
pnpm --filter vite-iframe-wagmi dev
# or
pnpm --filter vite-iframe dev
```

## FAQ

### What URL should I use for `src`?

The default (`https://widget.li.fi`) is the production-hosted widget — you don't need to set `src` at all for most use cases. For testing against a specific version or self-hosted deployment, pass your custom URL as `src`.

### Can I run multiple widgets on the same page?

Currently, `@lifi/widget-light` uses a module-level singleton for the event bus and guest bridge. Only one `<LiFiWidgetLight>` instance per page is supported.

### Why must config be JSON-serializable?

Configuration is sent to the iframe via `postMessage`, which uses the structured clone algorithm. React nodes, functions, class instances, and MUI theme objects cannot be cloned. Use the `WidgetLightConfig` type to ensure compatibility — the type system will catch non-serializable values at compile time.

### How does auto-resize work?

When `autoResize` is `true` (default), the iframe content uses a `ResizeObserver` to detect height changes and posts them to the host. The host directly mutates `iframe.style.height` for zero-flicker updates. Set `autoResize={false}` if you want to control iframe dimensions yourself via CSS.

### Do I need to handle reconnection after page refresh?

Wallet state is sent from your app to the iframe on every mount via the `INIT` handshake. If your wagmi/wallet-adapter handles reconnection (which most do by default), the widget will automatically receive the reconnected state.

## Support

- [LI.FI Widget Documentation](https://docs.li.fi/widget/overview)
- [GitHub Issues](https://github.com/lifinance/widget/issues)
- [Widget Playground](https://playground.li.fi) — interactively explore configuration options
