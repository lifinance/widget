/** @vitest-environment happy-dom */

import { act, createElement, type PropsWithChildren, type Ref } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let width = 240
let value = '1234567890'
let fetching = false
let observers: {
  callback: () => void
  target?: Element
  disconnected: boolean
}[]

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { value?: unknown }) =>
      String(options?.value ?? key),
  }),
}))
vi.mock('../../hooks/useLinkedLimitFields.js', () => ({
  useLinkedLimitFields: () => ({ setSendAmount: vi.fn() }),
}))
vi.mock('../../hooks/useToken.js', () => ({ useToken: () => ({}) }))
vi.mock('../../hooks/useRoutes.js', () => ({
  useRoutes: () => ({
    isFetching: fetching,
    routes: fetching
      ? undefined
      : [
          {
            toAmount: value,
            toToken: { decimals: 0, priceUSD: '0' },
          },
        ],
  }),
}))
vi.mock('../../providers/WidgetProvider/WidgetProvider.js', () => ({
  useWidgetConfig: () => ({ hiddenUI: { routeCardPriceImpact: true } }),
}))
vi.mock('../../stores/form/useFieldValues.js', () => ({
  useFieldValues: (...keys: string[]) =>
    keys.map((key) => (key === 'fromAmount' ? value : undefined)),
}))
vi.mock('../../stores/form/useFieldActions.js', () => ({
  useFieldActions: () => ({ setFieldValue: vi.fn() }),
}))
vi.mock('../../stores/inputMode/useInputModeStore.js', () => ({
  useInputModeStore: () => ({ inputMode: {}, toggleInputMode: vi.fn() }),
}))
vi.mock('../TokenPillButton/TokenPillButton.js', () => ({
  TokenPillButton: () => null,
}))
vi.mock('../Card/CardTitle.js', () => ({ CardTitle: () => null }))
vi.mock('../ProgressToNextUpdate.js', () => ({
  ProgressToNextUpdate: () => null,
}))
vi.mock('./BalanceDisplay.js', () => ({ BalanceDisplay: () => null }))
vi.mock('./FiatValueToggle.js', () => ({ FiatValueToggle: () => null }))
vi.mock('./PercentageChips.js', () => ({ PercentageChips: () => null }))
vi.mock('./AmountInputCard.style.js', () => ({
  AmountCard: ({ children }: PropsWithChildren) =>
    createElement('div', null, children),
  CardHeaderRow: 'div',
  CardBodyRow: 'div',
  CardFooterRow: 'div',
  FooterText: 'span',
  ToggleButton: ({ children }: PropsWithChildren) =>
    createElement('div', null, children),
  AmountDisplay: ({
    children,
    ref,
  }: PropsWithChildren<{ ref: Ref<HTMLSpanElement> }>) =>
    createElement('span', { ref, 'data-testid': 'amount' }, children),
  LargeInput: ({
    inputRef,
    value,
  }: {
    inputRef: Ref<HTMLInputElement>
    value: string
  }) => createElement('input', { ref: inputRef, value, readOnly: true }),
  amountHeight: 32,
  footerFontSize: 12,
  maxInputFontSize: 30,
  minInputFontSize: 20,
}))

const { SendAmountCard } = await import('./SendAmountCard.js')
const { ReceiveAmountCard } = await import('./ReceiveAmountCard.js')
let root: Root
let container: HTMLDivElement

beforeEach(() => {
  width = 240
  value = '1234567890'
  fetching = false
  observers = []
  vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
  vi.stubGlobal(
    'ResizeObserver',
    class {
      record: (typeof observers)[number]
      constructor(callback: () => void) {
        this.record = { callback, disconnected: false }
        observers.push(this.record)
      }
      observe(target: Element) {
        this.record.target = target
      }
      disconnect() {
        this.record.disconnected = true
      }
    }
  )
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(
    () => width
  )
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(
    function (this: HTMLElement) {
      const text =
        this instanceof HTMLInputElement ? this.value : (this.textContent ?? '')
      return (
        Math.max(
          width,
          Math.ceil(text.length * Number.parseFloat(this.style.fontSize) * 0.6)
        ) + 1
      )
    }
  )
  container = document.createElement('div')
  root = createRoot(container)
})

afterEach(() => {
  act(() => root.unmount())
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

const resize = (nextWidth: number) => {
  width = nextWidth
  act(() => {
    for (const observer of observers) {
      if (!observer.disconnected) {
        observer.callback()
      }
    }
  })
}

describe.each([
  ['send', SendAmountCard, 'input'],
  ['receive', ReceiveAmountCard, '[data-testid=amount]'],
] as const)('%s amount resizing', (_name, Component, selector) => {
  it('refits unchanged text when the container shrinks and grows', () => {
    act(() => root.render(createElement(Component)))
    const amount = container.querySelector<HTMLElement>(selector)!
    expect(amount.style.fontSize).toBe('30px')
    resize(132)
    expect(amount.style.fontSize).toBe('21px')
    resize(240)
    expect(amount.style.fontSize).toBe('30px')
  })

  it('still fits changed amounts and releases observers on unmount', () => {
    act(() => root.render(createElement(Component)))
    value = '12345678901234567890'
    act(() => root.render(createElement(Component)))
    expect(container.querySelector<HTMLElement>(selector)!.style.fontSize).toBe(
      '20px'
    )
    expect(observers.filter((observer) => !observer.disconnected)).toHaveLength(
      1
    )
    act(() => root.unmount())
    expect(observers.every((observer) => observer.disconnected)).toBe(true)
    root = createRoot(container)
  })
})

it('observes the receive amount when a loading placeholder disappears without a value change', () => {
  value = '0'
  fetching = true
  act(() => root.render(createElement(ReceiveAmountCard)))
  fetching = false
  act(() => root.render(createElement(ReceiveAmountCard)))
  const amount = container.querySelector<HTMLElement>('[data-testid=amount]')!
  expect(amount.style.fontSize).toBe('30px')
  expect(
    observers.some(
      (observer) => observer.target === amount && !observer.disconnected
    )
  ).toBe(true)
})
