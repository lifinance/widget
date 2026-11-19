---
"@lifi/widget": patch
---

Show "Quote request failed" when the routes request fails, for example with a 500 or a rate limit, instead of "No routes available". The swap card, the wide routes panel, the routes page and the limit form now tell a failed request apart from the API's answer that no route exists. A 404 still shows "No routes available", and routes from an earlier answer stay on screen through a failed refresh.
