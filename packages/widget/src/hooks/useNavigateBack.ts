import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { navigationRoutes } from '../utils/navigationRoutes'

export const useNavigateBack = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navigateBack = useCallback(() => {
    // TODO: find a better router with nested memory routers support
    // https://github.com/remix-run/react-router/pull/9112
    // https://github.com/remix-run/react-router/discussions/9601
    //
    // if (window.history.length > 2) {
    // navigate(-1)
    // } else {
    //   navigate(
    //     window.location.pathname.substring(
    //       0,
    //       window.location.pathname.lastIndexOf('/'),
    //     ) || '/',
    //     { replace: true },
    //   );
    // }

    // From transaction details page, navigate to home page
    const isTransactionDetailsPage = location.pathname.includes(
      navigationRoutes.transactionDetails
    )
    if (isTransactionDetailsPage) {
      navigate(navigationRoutes.home)
    } else {
      navigate(-1)
    }
  }, [navigate, location.pathname])

  return { navigateBack, navigate }
}
