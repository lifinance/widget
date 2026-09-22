---
'@lifi/widget': minor
'@lifi/widget-light': minor
---

Add a "Recent searches" section to the token select view. Tokens the user searches for and selects are stored locally (up to 10), shown 4 at a time with a toggle to reveal the rest. Clear empties the section, and individual entries can be removed from the row's hover actions on desktop. Hide the section with `hiddenUI: { recentSearches: true }`.
