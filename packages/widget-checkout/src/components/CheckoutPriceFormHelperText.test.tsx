// @vitest-environment happy-dom
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

const { fundingSourceRef } = vi.hoisted(() => ({
  fundingSourceRef: { current: 'cash' as string | null },
}))

vi.mock('@lifi/widget/shared', () => ({
  FormKeyHelper: {
    getChainKey: (f: string) => `${f}.chain`,
    getTokenKey: (f: string) => `${f}.token`,
    getAmountKey: (f: string) => `${f}.amount`,
  },
  formatTokenAmount: (v: unknown) => String(v),
  formatTokenPrice: () => '5.00',
  InputPriceButton: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  useFieldValues: () => ['1', '0xtoken', '5'],
  useInputModeStore: () => ({
    inputMode: { from: 'price', to: 'price' },
    toggleInputMode: () => {},
  }),
  useToken: () => ({
    token: { symbol: 'USDC', decimals: 6, priceUSD: '1' },
    isLoading: false,
  }),
  useTokenAddressBalance: () => ({ token: undefined, isLoading: false }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { value?: string }) => opts?.value ?? key,
  }),
}))

vi.mock('../hooks/useIsWalletFundedFlow.js', () => ({
  useIsWalletFundedFlow: () => false,
}))

vi.mock('../stores/useCheckoutFlowStore.js', () => ({
  useCheckoutFlowStore: (
    selector: (s: { fundingSource: string | null }) => unknown
  ) => selector({ fundingSource: fundingSourceRef.current }),
}))

import { CheckoutPriceFormHelperText } from './CheckoutPriceFormHelperText.js'

describe('CheckoutPriceFormHelperText', () => {
  it('renders no subtext for the cash "from" field', () => {
    fundingSourceRef.current = 'cash'
    const { container } = render(
      <CheckoutPriceFormHelperText formType="from" />
    )
    expect(container.firstChild).toBeNull()
    expect(screen.queryByText('USDC')).toBeNull()
  })

  it('renders the token subtext for non-cash funding sources', () => {
    fundingSourceRef.current = 'transfer'
    render(<CheckoutPriceFormHelperText formType="from" />)
    expect(screen.queryByText('USDC')).not.toBeNull()
  })
})
