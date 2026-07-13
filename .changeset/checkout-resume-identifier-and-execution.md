---
"@lifi/widget-checkout": minor
"@lifi/widget": minor
---

Fix wallet-flow resume to poll the correct status identifier and re-attach in-flight routes.

A resumed wallet payment now polls by the right identifier: relayer/gasless routes carry a `taskId`, which is distinct from a `txHash` in the SDK status API and was previously polled as a hash (so it never resolved). A still-executing wallet route is now resumed through the SDK on the transaction page, so it prompts for any remaining user action (a second source-chain signature, a destination-chain claim) instead of sitting on a status page it cannot advance. Routes evicted from the route store are re-seeded from the persisted snapshot before resuming.

`@lifi/widget` exports `isRouteActive`, `isRouteDone`, `isRouteFailed`, and the route-execution store accessors from `@lifi/widget/shared`.
