---
'@lifi/widget': major
---

The widget migrates its components from Material UI to the LI.FI design-system.

Migrated components are styled by a design-system stylesheet instead of the Material UI theme. Load it once alongside the widget:

```ts
import '@lifi/widget/styles.css'
```

To customize migrated components, add a stylesheet loaded after `@lifi/widget/styles.css` so its rules take precedence by source order.

Re-theme the widget by overriding the design-system tokens, with light values in `:root` and dark values in `.dark`:

```css
:root {
  --primary: oklch(0.7 0.19 44);
  --radius: 1rem;
}

.dark {
  --primary: oklch(0.78 0.16 44);
}
```

Restyle a single component by overriding its class in the `components` cascade layer:

```css
@layer components {
  .lifi-button-variant-default {
    text-transform: uppercase;
  }
}
```
