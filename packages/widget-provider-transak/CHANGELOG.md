# @lifi/widget-provider-transak

## 4.0.6

### Patch Changes

- Updated dependencies [[`4458495`](https://github.com/lifinance/widget/commit/4458495061371d770ba48ff856cb0feecf0c6357)]:
  - @lifi/widget-provider@4.6.1

## 4.0.5

### Patch Changes

- Updated dependencies [[`10d954a`](https://github.com/lifinance/widget/commit/10d954aaa9d4cc125c08045c0dd872d2549ec753), [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8), [`97e59c5`](https://github.com/lifinance/widget/commit/97e59c58c719805198e030a14fbe72fabde010c8)]:
  - @lifi/widget-provider@4.6.0

## 4.0.4

### Patch Changes

- Updated dependencies [[`0b3811c`](https://github.com/lifinance/widget/commit/0b3811ce2492b385219659632fd157b3b4923c57)]:
  - @lifi/widget-provider@4.5.1

## 4.0.3

### Patch Changes

- Updated dependencies [[`1590c19`](https://github.com/lifinance/widget/commit/1590c1907376b800c556b139a10400fc301ca2cf), [`e9c695f`](https://github.com/lifinance/widget/commit/e9c695f9981d60bd23cff85d2c3324a739ebf0d7), [`57ae5ac`](https://github.com/lifinance/widget/commit/57ae5ac7cbdd86579e8546e31c96109308f92128), [`0bf9966`](https://github.com/lifinance/widget/commit/0bf9966a23a1a56e79d58e6e99f02df5b913688b)]:
  - @lifi/widget-provider@4.5.0

## 4.0.2

### Patch Changes

- Updated dependencies [[`1d7bf36`](https://github.com/lifinance/widget/commit/1d7bf36f298db238e0402871a82488078da4b917), [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7), [`2b290ab`](https://github.com/lifinance/widget/commit/2b290abb0fe9adb1ac5c1f6eb6fbb55e158fadea), [`874158c`](https://github.com/lifinance/widget/commit/874158c47bcc83eb6a12317a56e57b4b0c3d29e7)]:
  - @lifi/widget-provider@4.4.0

## 4.0.1

### Patch Changes

- Updated dependencies [[`676c5b4`](https://github.com/lifinance/widget/commit/676c5b4b0e763bb0c069f49ac6f5afeeacb5f617)]:
  - @lifi/widget-provider@4.3.1

## 4.0.0

### Minor Changes

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Add quote-aware Transak checkout wiring by introducing onramp fiat-currencies and quote API contracts, extending onramp session payload/response fields, and carrying provider funding session metadata through checkout session state.

  Switch checkout cash funding to a fiat-first flow with live quote-driven route amounts, dynamic fiat currencies/payment methods, and persisted funding session ids for resume/reconciliation paths.

- [#817](https://github.com/lifinance/widget/pull/817) [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220) Thanks [@chybisov](https://github.com/chybisov)! - Add the Transak and Mesh on-ramp integration packages (host components and balance/session hooks) for the checkout flow.

### Patch Changes

- Updated dependencies [[`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220), [`682e043`](https://github.com/lifinance/widget/commit/682e0430644efc6f4463cb5e016f7f2f21078220)]:
  - @lifi/widget-provider@4.3.0
