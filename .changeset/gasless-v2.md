---
'@lifi/widget': minor
'@lifi/widget-light': minor
'@lifi/widget-provider': minor
'@lifi/widget-provider-ethereum': minor
---

Support the new LI.FI gasless flow. The `useGaslessRoutes` config option replaces `useRelayerRoutes`.

When `useGaslessRoutes` is on, the widget requests gasless routes with `options.gasless: true` next to the normal routes and adds the best one at position 2. It requests them only for an EVM source chain, a connected wallet, message signing on, and not in limit or private mode. A gasless route shows the "Gasless" tag, the free fee value and the gasless tooltip. The step list labels the relay fee step "Gasless service". The gas check skips gasless steps.

The relayer pays the gas of a gasless step. Its gas cost therefore counts as 0 in the fee breakdown and in the `gasCostUSD` of the widget events.

Breaking changes, released as a minor version because the legacy gasless service is shut down:

- `useRelayerRoutes` is renamed to `useGaslessRoutes` in `WidgetConfig` and in the widget-light config.
- `isGaslessStep` is removed from `EthereumProviderContext`. Use `isGaslessStep` from `@lifi/sdk`.
