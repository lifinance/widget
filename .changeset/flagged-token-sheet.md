---
"@lifi/widget": minor
---

Warn before a transaction that moves a flagged token. When the screening provider flagged the route's source or destination token, the widget now opens a sheet naming the token and asks for an explicit acknowledgement before the transaction starts. A native token is exempt, because the provider screens the native-address convention and reports it as a scam on some chains. Unverified tokens do not open the sheet, matching the token list, where only a definite verdict draws a badge.
