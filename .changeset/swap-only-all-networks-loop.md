---
'@lifi/widget': patch
---

Split swap no longer crashes when the source is on "All networks". The destination copied the empty source, the chain-order fallback refilled it, and an integrator that rebuilds `chains` from form state re-ran that effect on every write until React threw "Maximum update depth exceeded". The destination now follows only a chosen source. An empty destination takes the source chain rather than the first chain in the order, and a destination the chain list no longer offers falls back to one it does.
