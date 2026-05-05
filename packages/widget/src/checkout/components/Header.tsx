import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { Box, IconButton } from '@mui/material'
import { useLocation, useRouter } from '@tanstack/react-router'
import { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useSetHeaderHeight } from '../../stores/header/useHeaderStore.js'
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
  const title = titleProp ?? t('checkout.deposit')
  const { pathname } = useLocation()
  const router = useRouter()
  const navigate = useCheckoutNavigate()
  const modalContext = useCheckoutModal()
  const headerRef = useRef<HTMLDivElement>(null)
  const { setHeaderHeight } = useSetHeaderHeight()

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

  const titleAlignCenter = isHomePage || showBackButton

  return (
    <HeaderAppBar
      ref={headerRef}
      id={createElementId(ElementId.Header, elementId)}
      elevation={0}
    >
      <Box
        sx={{
          width: 48,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {showBackButton ? (
          <IconButton
            onClick={handleBack}
            size="medium"
            edge="start"
            aria-label="back"
          >
            <ArrowBackIcon />
          </IconButton>
        ) : null}
      </Box>
      <HeaderTitleTypography
        variant="h6"
        $isHomePage={isHomePage}
        $alignCenter={titleAlignCenter}
      >
        {title}
      </HeaderTitleTypography>
      <HeaderControlsContainer
        sx={{ width: 48, justifyContent: 'flex-end', flexShrink: 0 }}
      >
        <IconButton onClick={handleClose} size="medium" aria-label="close">
          <CloseIcon />
        </IconButton>
      </HeaderControlsContainer>
    </HeaderAppBar>
  )
}
