import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import { AppBar, Box, IconButton, styled, Typography } from '@mui/material'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useCheckoutDrawer } from '../providers/CheckoutDrawerContext.js'
import {
  backButtonRoutes,
  checkoutNavigationRoutes,
} from '../utils/navigationRoutes.js'

const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.vars?.palette?.text?.primary ?? theme.palette.text.primary,
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  minHeight: 48,
  padding: theme.spacing(1, 2),
  paddingTop: theme.spacing(1.5),
}))

const HeaderControlsContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})

interface CheckoutHeaderProps {
  title?: string
}

export const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({
  title = 'Deposit',
}) => {
  const { pathname } = useLocation()
  const navigate = useNavigate()
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
      <Typography
        variant="h6"
        sx={{
          flex: 1,
          fontWeight: 700,
          fontSize: isHomePage ? 24 : 18,
          textAlign: showBackButton ? 'center' : 'left',
        }}
      >
        {title}
      </Typography>
      <HeaderControlsContainer>
        <IconButton onClick={handleClose} size="medium" aria-label="close">
          <CloseIcon />
        </IconButton>
      </HeaderControlsContainer>
    </HeaderAppBar>
  )
}
