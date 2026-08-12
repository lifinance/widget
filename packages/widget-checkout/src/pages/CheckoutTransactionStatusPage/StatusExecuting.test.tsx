// @vitest-environment happy-dom

import type { Route } from '@lifi/sdk'
import { screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../../test/renderWithI18n.js'

vi.mock('@lifi/widget/shared', () => ({
  Card: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  RouteTokens: () => <div data-testid="route-tokens" />,
}))

vi.mock('./StatusStepList.js', () => ({
  StatusStepList: ({ phase }: { phase: string }) => (
    <div data-testid="step-list" data-phase={phase} />
  ),
}))

import { StatusExecuting } from './StatusExecuting.js'

const frozenRoute = { id: 'route-1' } as unknown as Route

describe('StatusExecuting', () => {
  it('shows the executing label with pending steps', () => {
    renderWithI18n(
      <StatusExecuting status={undefined} frozenRoute={frozenRoute} />
    )
    expect(screen.queryByText('Processing transaction')).not.toBeNull()
    expect(screen.queryByText('Watching for transaction')).toBeNull()
    expect(screen.queryByTestId('step-list')?.dataset.phase).toBe('pending')
    expect(screen.queryByTestId('route-tokens')).not.toBeNull()
  })
})
