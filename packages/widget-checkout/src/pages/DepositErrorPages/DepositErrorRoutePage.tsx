import { useParams } from '@tanstack/react-router'
import type { JSX } from 'react'
import {
  type DepositErrorKind,
  depositErrorPages,
  PRODUCTION_DEPOSIT_ERROR_KINDS,
} from './DepositErrorPages.js'

export function DepositErrorRoutePage(): JSX.Element | null {
  const { kind } = useParams({ strict: false }) as { kind?: string }
  const PageComponent = kind
    ? depositErrorPages[kind as DepositErrorKind]
    : undefined
  if (!PageComponent) {
    return null
  }
  // Preview-only kinds render mocked amounts; only the kinds the status poll
  // navigates to may render in production.
  if (
    process.env.NODE_ENV !== 'development' &&
    !PRODUCTION_DEPOSIT_ERROR_KINDS.has(kind as DepositErrorKind)
  ) {
    return null
  }
  return <PageComponent />
}
