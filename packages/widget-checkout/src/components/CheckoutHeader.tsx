import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import { useLocation } from '@tanstack/react-router'
import { useCheckoutNavigate } from '../hooks/useCheckoutNavigate.js'
import { useCheckoutDrawer } from '../providers/CheckoutDrawerContext.js'
import {
  backButtonRoutes,
  checkoutNavigationRoutes,
} from '../utils/navigationRoutes.js'
import {
  HeaderAppBar,
  HeaderControlsContainer,
  HeaderTitleTypography,
} from './CheckoutHeader.style.js'

interface CheckoutHeaderProps {
  title?: string
}

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({
  title = 'Deposit',
}) => {
  const { pathname } = useLocation()
  const navigate = useCheckoutNavigate()
  const drawerContext = useCheckoutDrawer()

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
    drawerContext?.closeDrawer()
  }

  return (
    <HeaderAppBar elevation={0}>
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
