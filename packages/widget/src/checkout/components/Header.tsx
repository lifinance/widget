import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import { useLocation } from '@tanstack/react-router'
import { useLayoutEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSetHeaderHeight } from '../../stores/header/useHeaderStore.js'
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
  const { t } = useTranslation()
  const title = titleProp ?? t('checkout.deposit')
  const { pathname } = useLocation()
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
    navigate({ to: '..' })
  }

  const handleClose = () => {
    modalContext?.closeModal()
  }

  return (
    <HeaderAppBar ref={headerRef} elevation={0}>
      {showBackButton && (
        <IconButton
          onClick={handleBack}
          size="medium"
          edge="start"
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
      )}
      <HeaderTitleTypography
        variant="h6"
        $isHomePage={isHomePage}
        $alignCenter={showBackButton}
      >
        {title}
      </HeaderTitleTypography>
      <HeaderControlsContainer>
        <IconButton onClick={handleClose} size="medium" aria-label="close">
          <CloseIcon />
        </IconButton>
      </HeaderControlsContainer>
    </HeaderAppBar>
  )
}
