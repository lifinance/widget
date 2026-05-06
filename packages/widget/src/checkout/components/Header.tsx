import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton } from '@mui/material'
import { useLocation, useRouter } from '@tanstack/react-router'
import { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ProgressToNextUpdate } from '../../components/ProgressToNextUpdate.js'
import { useRoutes } from '../../hooks/useRoutes.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import {
  useHeaderStore,
  useSetHeaderHeight,
} from '../../stores/header/useHeaderStore.js'
import { createElementId, ElementId } from '../../utils/elements.js'
import { useCheckoutModal } from '../CheckoutModal.js'
import { useCheckoutNavigate } from '../hooks/useCheckoutNavigate.js'
import {
  backButtonRoutes,
  checkoutNavigationRoutes,
} from '../utils/navigationRoutes.js'
import {
  HeaderAppBar,
  HeaderControlsContainer,
  HeaderTitleTypography,
} from './Header.style.js'

interface HeaderProps {
  title?: string
}

export const Header: React.FC<HeaderProps> = ({ title: titleProp }) => {
  const { elementId } = useWidgetConfig()
  const { t } = useTranslation()
  // Children can override the layout's pathname-derived title via useHeader().
  const storeTitle = useHeaderStore((state) => state.title)
  const title = storeTitle ?? titleProp ?? t('checkout.deposit')
  const { pathname } = useLocation()
  const router = useRouter()
  const navigate = useCheckoutNavigate()
  const modalContext = useCheckoutModal()
  const headerRef = useRef<HTMLDivElement>(null)
  const { setHeaderHeight } = useSetHeaderHeight()
  const { isLoading, isFetching, routes, dataUpdatedAt, refetchTime } =
    useRoutes()

  useLayoutEffect(() => {
    const handleResize = () => {
      const height = headerRef.current?.getBoundingClientRect().height
      if (height) {
        setHeaderHeight(height)
      }
    }

    let resizeObserver: ResizeObserver
    if (headerRef.current) {
      resizeObserver = new ResizeObserver(handleResize)
      resizeObserver.observe(headerRef.current)
    }

    return () => {
      resizeObserver?.disconnect()
    }
  }, [setHeaderHeight])

  const cleanedPathname = pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname
  const path = cleanedPathname.substring(cleanedPathname.lastIndexOf('/') + 1)
  const showBackButton = backButtonRoutes.includes(path)
  const isHomePage = pathname === checkoutNavigationRoutes.home
  const showQuoteIndicator =
    !isHomePage &&
    path !== 'enter-amount' &&
    path !== checkoutNavigationRoutes.transactionStatus &&
    path !== checkoutNavigationRoutes.transactionDetails

  const handleBack = () => {
    if (router.history.length > 1) {
      router.history.go(-1)
      return
    }
    navigate({ to: checkoutNavigationRoutes.home, replace: true })
  }

  const handleClose = () => {
    modalContext?.closeModal()
  }

  // The back-button slot is always rendered (with `visibility: hidden` when
  // not active) so layout space is reserved on every page; always center the
  // title rather than tying centering to back-button presence.
  const titleAlignCenter = true

  return (
    <HeaderAppBar
      ref={headerRef}
      id={createElementId(ElementId.Header, elementId)}
      elevation={0}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <IconButton
          onClick={showBackButton ? handleBack : undefined}
          size="medium"
          edge="start"
          aria-label={t('button.cancel')}
          tabIndex={showBackButton ? undefined : -1}
          sx={{ visibility: showBackButton ? 'visible' : 'hidden' }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <HeaderTitleTypography
        variant="h6"
        $isHomePage={isHomePage}
        $alignCenter={titleAlignCenter}
      >
        {title}
      </HeaderTitleTypography>
      <HeaderControlsContainer
        sx={{ justifyContent: 'flex-end', flexShrink: 0 }}
      >
        {showQuoteIndicator ? (
          <ProgressToNextUpdate
            updatedAt={dataUpdatedAt}
            timeToUpdate={refetchTime}
            isLoading={isLoading || (isFetching && !routes?.[0])}
          />
        ) : null}
        <IconButton
          onClick={handleClose}
          size="medium"
          aria-label={t('button.close')}
        >
          <CloseIcon />
        </IconButton>
      </HeaderControlsContainer>
    </HeaderAppBar>
  )
}
