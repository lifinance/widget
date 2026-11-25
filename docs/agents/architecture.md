# Widget architecture

## widget-light iframe bridge

`widget-light` runs the widget inside an iframe (`widget-embedded`) and talks to the host page through `postMessage`. `packages/widget-light/src/shared/protocol.ts` defines the messages: the `READY`/`INIT` handshake, `CONFIG_UPDATE`, `RPC_REQUEST`/`RPC_RESPONSE` for wallet calls, and the wallet and widget events.

## widget internals

- **State**: Zustand stores in `packages/widget/src/stores/`
- **Routing**: TanStack Router with page components in `src/pages/`
- **Theming**: MUI v9 + Emotion; custom themes in `src/themes/`
- **Events**: `eventemitter3` (`widgetEvents` singleton in `src/hooks/useWidgetEvents.ts`) — clean up listeners with `.off(event, handler)` / `.removeAllListeners()`; there is no mitt-style `.all` map
- **i18n**: i18next with 17 locale files in `src/i18n/`; `en.json` types the keys

## Provider layering (widget)

QueryClient → Settings → WidgetConfig → I18n → Theme → SDK → Wallet → Store
