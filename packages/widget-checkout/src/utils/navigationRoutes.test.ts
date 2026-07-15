import { describe, expect, it } from 'vitest'
import {
  backButtonRoutes,
  checkoutAbsolutePaths,
  checkoutNavigationRoutes,
  checkoutNavigationRoutesValues,
} from './navigationRoutes.js'

describe('checkoutAbsolutePaths', () => {
  it('prefixes the transactionExecution segment with /', () => {
    expect(checkoutAbsolutePaths.transactionExecution).toBe(
      '/transaction-execution'
    )
  })
})

describe('checkoutNavigationRoutes', () => {
  it('uses absolute paths for top-level checkout routes', () => {
    expect(checkoutNavigationRoutes.home).toBe('/')
    expect(checkoutNavigationRoutes.enterAmount.startsWith('/')).toBe(true)
    expect(checkoutNavigationRoutes.progress.startsWith('/')).toBe(true)
    expect(checkoutNavigationRoutes.transferDeposit.startsWith('/')).toBe(true)
    expect(checkoutNavigationRoutes.selectCash.startsWith('/')).toBe(true)
  })

  it('uses relative segments for nested sub-routes', () => {
    expect(checkoutNavigationRoutes.fromToken.startsWith('/')).toBe(false)
    expect(checkoutNavigationRoutes.fromChain.startsWith('/')).toBe(false)
    expect(checkoutNavigationRoutes.routes.startsWith('/')).toBe(false)
    expect(checkoutNavigationRoutes.transactionExecution.startsWith('/')).toBe(
      false
    )
    expect(checkoutNavigationRoutes.transactionDetails.startsWith('/')).toBe(
      false
    )
    expect(checkoutNavigationRoutes.transactionStatus.startsWith('/')).toBe(
      false
    )
  })
})

describe('checkoutNavigationRoutesValues', () => {
  it('is a non-empty list of all route values', () => {
    expect(checkoutNavigationRoutesValues).toEqual(
      Object.values(checkoutNavigationRoutes)
    )
    expect(checkoutNavigationRoutesValues.length).toBeGreaterThan(0)
  })
})

describe('backButtonRoutes', () => {
  it('uses bare segments (no leading slash) so they match path leaves', () => {
    for (const r of backButtonRoutes) {
      expect(r.startsWith('/')).toBe(false)
    }
  })

  it('includes the well-known back-eligible routes', () => {
    expect(backButtonRoutes).toContain('enter-amount')
    expect(backButtonRoutes).toContain('select-cash')
    expect(backButtonRoutes).toContain('transfer-deposit')
    expect(backButtonRoutes).toContain(
      checkoutNavigationRoutes.transactionDetails
    )
  })

  it('excludes status / progress / error routes so they never show a back button', () => {
    expect(backButtonRoutes).not.toContain('progress')
    expect(backButtonRoutes).not.toContain(
      checkoutNavigationRoutes.transactionExecution
    )
    expect(backButtonRoutes).not.toContain(
      checkoutNavigationRoutes.transactionStatus
    )
  })
})
