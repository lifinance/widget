---
'@lifi/widget': patch
---

In `mode: 'refuel'`, let users select any quote in the quotes list of the wide layout. Before, a click on a quote did nothing, because the quote rendered without the card that handles the click. Refuel mode also no longer shows the "Get {chain} gas" toggle and no longer adds extra gas to the quote request, because the mode already delivers gas.
