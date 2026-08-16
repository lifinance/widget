# LI.FI Widget + React Native (WebView) Example

This project shows how to run the LI.FI Widget inside a React Native app. The
widget renders in a [`react-native-webview`](https://github.com/react-native-webview/react-native-webview),
and the React Native host serves it a wallet over an EIP-1193 provider that is
injected before the page loads and announced via EIP-6963. From the widget's
point of view the host app is just another injected wallet, so no widget
internals are touched.

## How it works

- The host injects a small EIP-1193 provider into the WebView with
  `injectedJavaScriptBeforeContentLoaded` and announces it via EIP-6963, so
  the widget's wallet menu lists the host app like any browser wallet
  (`src/bridge/injectedProvider.ts`).
- Every `request({ method, params })` from the page is forwarded to React
  Native over `postMessage` with an id-correlated response. The host answers
  reads and signs transactions with [viem](https://viem.sh) in-process; keys
  never enter the WebView (`src/bridge/walletHost.ts`).
- `chainChanged` / `accountsChanged` events and the EIP-1193 `4001` rejection
  code are forwarded back into the page, so the widget's route execution stays
  in sync and recovers cleanly when the user rejects.

## Project layout

Two packages, run together:

| Package | Role |
| --- | --- |
| `../react-native-webview-widget-page` | A small Vite page that renders `<LiFiWidget>`. Served from a real origin (never `file://`, whose opaque origin breaks `localStorage` on Android). |
| `react-native-webview` (this one) | The Expo host app: the WebView, the injected provider, and the viem-backed wallet host. |

## Requirements

- [Node](https://nodejs.org) + [pnpm](https://pnpm.io)
- Xcode (iOS) and/or Android Studio for a native build. Expo's New
  Architecture is used, so this needs a dev build, not Expo Go.

## Installation

From the repo root:

```bash
pnpm install
```

## Run

1. Start the widget page (defaults to `http://localhost:5174`):

   ```bash
   pnpm --filter react-native-webview-widget-page dev
   ```

2. Point `WIDGET_PAGE_BASE` in `App.tsx` at that server. `localhost` works for
   the iOS simulator; use your machine's LAN IP for a physical device.

3. Build and launch the host app:

   ```bash
   pnpm --filter react-native-webview-example-app ios
   # or: pnpm --filter react-native-webview-example-app android
   ```

Open the widget's wallet menu and you will see the host app listed. Connect,
and requests round-trip through a native approval prompt.

## Wallets and chains

EVM only. The widget takes wallet providers explicitly since v4, so the page
passes `providers: [EthereumProvider()]`; the host's injected provider is
picked up by wagmi's multi-injected-provider discovery inside it.
Solana / Sui / Tron are separate provider families and are not covered here.

The example signs in-process with a viem local account. An external
WalletConnect wallet works the same way (it is just another EIP-1193 source on
the host), but app-switching suspends WKWebView JS timers on iOS, which can
freeze the widget mid-route, so in-process signing keeps the example simple.

## Optional: local swap harness

`App.tsx` has a `HARNESS` flag (off by default) for exercising a full swap
against a local [anvil](https://book.getfoundry.sh/anvil/) mainnet fork with no
real funds:

```bash
anvil --fork-url <mainnet-rpc> --chain-id 1
```

With `HARNESS = true`, the wallet becomes anvil's well-known account #0 and
both the app's and the widget's chain-1 reads are pointed at the fork, so a
same-chain swap executes end-to-end. anvil's account #0 key is public and holds
nothing outside a fork.
