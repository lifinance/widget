---
"@lifi/wallet-management": patch
"@lifi/widget": patch
"@lifi/widget-checkout": patch
---

Update `i18next` to 27.1.1 and `react-i18next` to 18.0.1.

`Trans` text now always decodes HTML entities. If your `languageResources` override `tooltip.progressToNextUpdate`, `checkout.legal.termsDisclaimer` or `checkout.transferDeposit.warning` with an entity such as `&amp;` or `&nbsp;`, the widget now shows the character instead of the entity. The built-in translations have no entities, so they do not change.

With `i18next` 27.1, if your `languageResources` do not have the plural form that a count needs, the widget shows the `_other` form of the same language. Before, it showed the fallback language. An example is the French `many` form for exact millions. The built-in translations have no plural forms, so they do not change.
