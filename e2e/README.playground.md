# Playground E2E Tests

Playwright tests for the **LI.FI Widget Playground** — the interactive sidebar that controls every widget setting. Tests verify that each control changes the widget's appearance and behaviour correctly.

**162 tests · 11 spec files · 3 intentional regressions**

---

## Running locally

Run from the repo root — no need to start a server or `cd` anywhere. Each script
builds/serves the playground automatically and tears it down when finished.

```bash
pnpm e2e         # preview mode — full suite against the production build (:4173); matches CI
pnpm e2e:dev     # dev mode — smoke subset (tests/dev/) against the Vite dev server (:3000)
pnpm e2e:ui      # preview suite in Playwright's interactive UI
pnpm e2e:report  # open the last HTML report
```

**Preview** (`pnpm e2e`) runs the production build — the environment closest to what
ships, and what CI runs. Its `webServer` builds the playground on first run and reuses
an already-running server on reruns.

**Dev** (`pnpm e2e:dev`) runs against the Vite dev server — picks up source changes via
HMR, no build. The fast sanity loop; covers the smoke subset in `tests/dev/`.

> If a server is already up on the target port (e.g. you ran `pnpm dev` yourself),
> Playwright reuses it instead of starting its own.

### Lower-level flags

These invoke the Playwright binary directly (the `webServer` still manages the server
automatically). Run them from `e2e/`, where `@lifi/widget-e2e` and its Playwright binary
live — or prefix with `pnpm --filter @lifi/widget-e2e exec`.

```bash
# Run a single spec file
pnpm exec playwright test settings.theme.spec.ts

# Filter by test name
pnpm exec playwright test -g "Jumper theme"

# Headed (visible browser)
pnpm exec playwright test --headed -g "my test"

# Debug mode (step through)
pnpm exec playwright test --debug -g "my test"

# Dev-mode config explicitly
pnpm exec playwright test --config playwright.dev.config.ts

# Open last HTML report
pnpm exec playwright show-report playwright-report/
```

---

## Test coverage

### `tests/dev/smoke.spec.ts` — 4 tests *(dev mode)*

Sanity checks that the playground loads and the widget mounts. Runs against the
Vite dev server via `pnpm e2e:dev` — not part of the preview suite.

| Test | Asserts |
|---|---|
| sidebar is visible with nav controls | Logo, "PLAYGROUND" text, nav buttons |
| widget container is displayed with Exchange heading | Widget root + heading |
| clicking the Settings icon opens the Settings view | Settings rows visible |
| token route setup — From and To tokens selected | Full token selector flow |

---

### `settings.spec.ts` — 5 tests

General sidebar controls not tied to a specific settings section.

| Test | Asserts |
|---|---|
| sidebar logo and header are visible | Logo img + "PLAYGROUND" text |
| opens the settings sidebar | Settings button toggles sidebar |
| collapses and re-opens sidebar | Close/Open tools buttons |
| resets the full config | Global Reset config button reverts all settings |
| Read our docs link | Opens docs.li.fi in a new tab |

---

### `settings.mode.spec.ts` — 9 tests

The Mode section controls which exchange flows are enabled.

| Test | Asserts |
|---|---|
| Exchange mode is selected by default | Nav label + heading + reverse tokens button |
| selects Swap or Bridge mode | Tab strip with both tabs, Swap active |
| selects Swap mode | Heading "Swap"; no Bridge tab in DOM |
| selects Bridge mode | Heading "Bridge"; no Swap tab in DOM |
| selects Refuel mode | Heading "Gas"; reverse button absent |
| "Read docs" link | Opens docs in new tab |
| **Swap mode shows only the Swap tab** | `splitTabs` absent; Bridge tab not attached |
| **Bridge mode shows only the Bridge tab** | `splitTabs` absent; Swap tab not attached |
| resets mode to default | Nav reverts to Exchange |

---

### `settings.variant.spec.ts` — 18 tests

The Variant section switches between Wide, Compact, and Drawer layouts.

| Describe | Tests |
|---|---|
| **Compact** | Nav label; From/To open token selector inline (no chain sidebar) |
| **Drawer** | Nav label; toggle button visible and functional; From/To navigate inline |
| **Wide** | Default; From/To open chain sidebar; Disable chain sidebar suppresses it on both buttons; Reset reverts label and re-enables chain sidebar; Toggle footer absent in Compact; Read docs link |

---

### `settings.height.spec.ts` — 34 tests + 1 regression

The Height section controls the widget's size.

| Describe | Tests |
|---|---|
| **Default** | Initial state label; "fill viewport" copy in Drawer |
| **Restricted height** | Enabled in Wide/Compact; disabled in Drawer; reveals input; nav label; ≥686 applies CSS height; <686 cleared on blur; decimal truncated; 686 boundary accepted; Clear empties input and removes CSS |
| **Restricted max height** | Same 8 tests mirrored for max-height |
| **Full height** | Disabled in Wide/Drawer; enabled in Compact; nav label; container becomes `display:flex` |
| **Reset** | From Restricted height; from Restricted max height; from Full height |
| **Drawer variant** | Restricted height and max height inputs absent from DOM |
| **Docs link** | Opens docs in new tab |
| **⚠ EMB-421** *(fails — PR #766)* | Nav label and CSS height persist after `page.reload()` |

---

### `settings.wallet-management.spec.ts` — 27 tests

The Wallet Management section controls which wallet provider handles connections.

| Describe | Tests |
|---|---|
| **Internal** (default) | Nav label; header Connect wallet visible; no AppKit button; header/transaction buttons open internal modal |
| **External** | Nav label; header button absent; AppKit button present; Force internal toggle shown; transaction → AppKit modal; Close button in nav header (Drawer mode); force-internal flag cleared on switch to Partial |
| **External + Force internal** | Toggle checked; header button reappears; AppKit still present; transaction → internal modal |
| **Partial** | Nav label; header button visible; AppKit present; no force-internal toggle; header → internal modal; transaction → AppKit modal |
| **Reset** | From External; from Partial; with Force internal active |

---

### `settings.developer-controls.spec.ts` — 28 tests + 2 skipped

Developer tools for testing widget behaviour without writing integration code.

| Describe | Tests |
|---|---|
| **Default state** | All 5 toggles off; widget form empty |
| **Form values** | Toggle on → prefills ETH→USDC + URL params; toggle off → clears; config/formRef tabs; chains/tokens presets; amount preset |
| **Bookmark stores** | Toggle → 50 wallets seeded after reload; list visible; clearing removes them |
| **Loading preview** | Skeleton shown/hidden; disabled in Drawer |
| **Mock header** | Disabled in default/Wide; enabled in Compact+Full height; shows/hides element; ~~not clipped~~ *(skipped — PR #770)* |
| **Mock footer** | Disabled in default; enabled in Compact+Full height; fixed footer sub-toggle; header+footer together; ~~all in viewport~~ *(skipped — PR #770)* |
| **Widget events** | Configure opens panel; master toggle sets URL param; individual SettingUpdated event fires; back navigation |

---

### `settings.theme.spec.ts` — 21 tests + 2 regressions

The Theme section controls widget colours, typography, and surface styles.

| Group | Tests |
|---|---|
| **Presets** | Default initial; cycling all 5 changes viewport background CSS var + resets; each preset verified via `--lifi-palette-primary-main` |
| **Dark mode** | Default and Jumper respond to system dark mode (`emulateMedia`); Azure/Watermelon/Win95 have no Dark palette tab |
| **Colour palette** | Light mode hex edit + CSS var; Dark mode tab switch + hex edit; Primary color hex edit |
| **Typography** | Font family change to Poppins verified on widget heading |
| **Widget surface** | Corner radius slider; drop shadow toggle + Offset Y sub-slider; border toggle + color/weight sub-controls |
| **Card/Button surface** | Corner radius, drop shadow, border |
| **Reset** | Global Reset reverts widget border |
| **Route side panel** | Jumper primary colour persists when chain sidebar opens |
| **⚠ EMB-418** *(fails — PR #764)* | Viewport background resets when switching Jumper→Default |
| **⚠ EMB-424** *(fails — PR #769)* | Theme switch preserves restricted height setting |

---

### `settings.cross.spec.ts` — 6 tests

Cross-setting interactions where two settings combine to produce observable behaviour.

| Describe | Tests |
|---|---|
| **Height × Developer Controls** | Full height enables mock header/footer toggles; switching away disables them |
| **Variant × Height** | Switching to Drawer disables Restricted height card and clears CSS; switching to Wide disables Full height card |
| **Theme × Compact** | Jumper primary colour persists after switching to Compact variant |

---

### `settings.persistence.spec.ts` — 4 tests

Settings that must survive a `page.reload()` (guards against config schema regressions like PR #760).

| Test |
|---|
| Bridge mode survives page reload |
| Compact variant survives page reload |
| External wallet mode survives page reload |
| Jumper theme survives page reload |

---

### `settings.mode-variant.spec.ts` — 8 tests

Combinations of Mode + Variant that affect layout and navigation.

| Describe | Tests |
|---|---|
| Swap or Bridge + Compact | Tab strip correct; From/To navigate inline |
| Refuel + Compact | UI correct; From navigates inline |
| Bridge + Drawer | UI correct inside drawer; From navigates inline |

---

## Intentionally failing tests

Three tests are permanently failing until their corresponding PRs merge. They function as regression guards — when the fix lands, the test goes green automatically.

| Test | File | PR |
|---|---|---|
| viewport background resets when switching Jumper→Default | `settings.theme.spec.ts` | [#764](https://github.com/lifinance/widget/pull/764) EMB-418 |
| restricted height persists nav label and CSS after reload | `settings.height.spec.ts` | [#766](https://github.com/lifinance/widget/pull/766) EMB-421 |
| switching themes preserves restricted height setting | `settings.theme.spec.ts` | [#769](https://github.com/lifinance/widget/pull/769) EMB-424 |

Do **not** delete or skip these tests — they are the mechanism that proves the fix works.

---

## Adding new tests

1. Add locators to the relevant Component Object in `tests/components/`, not to the spec file.
2. Use `test.describe` + `test.step` structure. Each step = one action or assertion group.
3. Run the app first: take a screenshot with `pnpm exec playwright screenshot --browser chromium http://localhost:3000 /tmp/check.png` before writing assertions.
