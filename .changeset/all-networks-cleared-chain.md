---
'@lifi/widget': patch
---

fix(chains): keep "All networks" selected once the user picks it

On a page opened with a chain — a refresh, or a shared link — choosing
"All networks" could put that chain straight back, and repeated clicks
alternated between two chains the user never picked, so the selection could
never be changed to all networks.

`ChainOrderStoreProvider` decides the mode from the config chain and the query
string, and at the moment of the click both still name the chain the page was
opened on: the widget rewrites the query string a commit later, and an
integrator that seeds its config from the URL never rewrites it. Any integrator
whose config identity changes in response to form state re-runs the effect
inside that window, where it reads the stale values, turns the mode off and
refills the chain from the persisted chain order.

A chain field that is touched and empty has been cleared deliberately, which is
what "All networks" does, and that now outranks both stale values.
