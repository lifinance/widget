---
'@lifi/widget': patch
---

Stop the embedded widget from scrolling the host page to the top on every internal navigation.

`AppDefault` creates a TanStack router on a memory history and set no scroll options. router-core
runs `setupScrollRestoration` on every client router whatever the history, and its `onRendered`
handler calls `window.scrollTo({ top: 0, left: 0 })` after each navigation unless that navigation
passed `resetScroll: false`. The widget's own navigations never pass it, so opening the From/To token
list, selecting a token, settings or route details threw the host page back to the top — on a phone,
where the widget usually sits below the fold, every tap moved the user away from the widget.

The router is now created with `scrollRestoration: () => false`. `onRendered` returns before any
scrolling, which is what an embedded memory-history router wants: it should never scroll the window
it does not own. No public API changes.
