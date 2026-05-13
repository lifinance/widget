import { useMeshSession } from '@lifi/widget-provider/checkout'
import { Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { type JSX, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useHeaderStore } from '../../stores/header/useHeaderStore.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { checkoutNavigationRoutes } from '../utils/navigationRoutes.js'
import { OnRampFailureScreen } from './OnRampFailureScreen.js'

const statusPath = `/${navigationRoutes.transactionExecution}/${checkoutNavigationRoutes.transactionStatus}`

/**
 * Owns the post-Mesh control flow:
 *  - When Mesh opens (no hash yet), navigate to the deposit page so it can
 *    render the "Watching for deposit" state.
 *  - When Mesh reports a real on-chain hash, navigate again with the hash so
 *    the deposit page can poll status and render executing → success.
 *  - When Mesh ends in a terminal failure (connection / withdrawal), swap the
 *    routed body for the failure screen with retry.
 *  - Otherwise renders the routed page as normal.
 */
export function OnRampFlowOutlet(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const mesh = useMeshSession()
  const failure = mesh?.failure ?? null
  const isOpen = mesh?.isOpen ?? false
  const depositTxHash = mesh?.depositTxHash ?? null
  const acknowledge = mesh?.acknowledgeDepositTxHash
  const navigatedForOpenRef = useRef(false)

  // Override the layout's pathname-derived title only while a failure is shown.
  // The checkout Header reads the store title ahead of its prop.
  const setTitle = useHeaderStore((state) => state.setTitle)
  useEffect(() => {
    if (!failure) {
      return
    }
    return setTitle(t('checkout.deposit'))
  }, [failure, setTitle, t])

  // Navigate to the deposit page once Mesh opens so the user sees the
  // "Watching for deposit" state. Guard with a ref so we don't repeatedly
  // push while the modal is open.
  useEffect(() => {
    if (!isOpen) {
      navigatedForOpenRef.current = false
      return
    }
    if (navigatedForOpenRef.current) {
      return
    }
    if (pathname === statusPath) {
      navigatedForOpenRef.current = true
      return
    }
    navigatedForOpenRef.current = true
    navigate({ to: statusPath, search: {} })
  }, [isOpen, navigate, pathname])

  useEffect(() => {
    if (!depositTxHash) {
      return
    }
    navigate({
      to: statusPath,
      search: { transactionHash: depositTxHash },
    })
    acknowledge?.()
  }, [acknowledge, depositTxHash, navigate])

  if (failure) {
    return (
      <OnRampFailureScreen
        kind={failure.kind}
        providerName="Mesh"
        description={failure.message}
        onRetry={failure.retry}
      />
    )
  }

  return <Outlet />
}
