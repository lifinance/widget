---
'@lifi/widget': minor
'@lifi/wallet-management': minor
'@lifi/widget-light': minor
'@lifi/widget-provider': minor
'@lifi/widget-provider-ethereum': minor
'@lifi/widget-provider-solana': minor
'@lifi/widget-provider-bitcoin': minor
'@lifi/widget-provider-sui': minor
'@lifi/widget-provider-tron': minor
---

Drop React 18 support and require React 19+. The `react`/`react-dom` peer dependency range is narrowed from `>=18` to `>=19`, and the components are modernized to React 19 idioms (refs passed as props instead of `forwardRef`, `use()` for context). The `widget-provider-*` packages now use React-19-only APIs and declare a `react: >=19` peer dependency. Integrators must be on React 19 or newer.
