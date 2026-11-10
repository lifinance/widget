---
"@lifi/wallet-management": patch
"@lifi/widget": patch
"@lifi/widget-checkout": patch
---

Update `i18next` to 27.0.1 and `react-i18next` to 18.0.0.

`Trans` text now always decodes HTML entities. If your `languageResources` override `tooltip.progressToNextUpdate`, `checkout.legal.termsDisclaimer` or `checkout.transferDeposit.warning` with an entity such as `&amp;` or `&nbsp;`, the widget now shows the character instead of the entity. The built-in translations have no entities, so they do not change.
