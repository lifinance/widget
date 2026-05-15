import { useParams } from '@tanstack/react-router'
import type { JSX } from 'react'
import {
  type DepositErrorKind,
  depositErrorPages,
} from './DepositErrorPages.js'

export function DepositErrorRoutePage(): JSX.Element | null {
  const { kind } = useParams({ strict: false }) as { kind?: string }
  const PageComponent = kind
    ? depositErrorPages[kind as DepositErrorKind]
    : undefined
  if (!PageComponent) {
    return null
  }
  return <PageComponent />
}
