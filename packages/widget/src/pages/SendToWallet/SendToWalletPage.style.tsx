import {
  Alert,
  alertClasses,
  Box,
  IconButton,
  inputBaseClasses,
  List,
  styled,
  Typography,
} from '@mui/material'
import type React from 'react'
import { ButtonTertiary } from '../../components/ButtonTertiary.js'
import { InputCard } from '../../components/Card/InputCard.js'
import { Input } from '../../components/Input.js'
import type { PageContainerProps } from '../../components/PageContainer.js'
import { PageContainer } from '../../components/PageContainer.js'

export const AddressInput: React.FC<
  React.ComponentProps<typeof Input> & PageContainerProps
> = styled(Input)(({ theme }) => ({
  padding: 0,
  [`.${inputBaseClasses.input}`]: {
    padding: theme.spacing(2),
    minHeight: 48,
  },
}))

export const BookmarkInputFields: React.FC<
  React.ComponentProps<typeof Box> & PageContainerProps
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
}))

export const SendToWalletPageContainer: React.FC<
  React.ComponentProps<typeof PageContainer> & PageContainerProps
> = styled(PageContainer)<PageContainerProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}))

interface FullHeightAdjustablePageContainerProps extends PageContainerProps {
  enableFullHeight?: boolean
}

export const FullHeightAdjustablePageContainer: React.FC<
  React.ComponentProps<typeof PageContainer> &
    FullHeightAdjustablePageContainerProps
> = styled(SendToWalletPageContainer, {
  shouldForwardProp: (prop) => prop !== 'enableFullHeight',
})<FullHeightAdjustablePageContainerProps>(({ theme, enableFullHeight }) => ({
  justifyContent: 'space-between',
  ...(enableFullHeight && theme.container?.height === '100%'
    ? {
        justifyContent: 'space-between',
        height: '100%',
      }
    : {}),
}))

export const SendToWalletCard: React.FC<
  React.ComponentProps<typeof InputCard>
> = styled(InputCard)({
  display: 'flex',
  flexDirection: 'column',
})

export const SendToWalletSheetContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4, 3, 3),
  gap: theme.spacing(2),
}))

export const SendToWalletButtonRow: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    width: '100%',
    gap: theme.spacing(1),
  }))

export const SendToWalletIconButton: React.FC<
  React.ComponentProps<typeof ButtonTertiary>
> = styled(ButtonTertiary)(({ theme }) => ({
  padding: theme.spacing(1.25),
  minWidth: 40,
}))

export const IconContainer: React.FC<React.ComponentProps<typeof Box>> = styled(
  Box
)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 80,
  height: 80,
  borderRadius: '50%',
  color: theme.vars.palette.grey[700],
  background: theme.vars.palette.grey[200],
  ...theme.applyStyles('dark', {
    color: theme.vars.palette.grey[300],
    background: theme.vars.palette.grey[800],
  }),
}))

export const SheetTitle: React.FC<React.ComponentProps<typeof Typography>> =
  styled(Typography)(() => ({
    fontSize: 18,
    fontWeight: 700,
  }))

export const SheetAddressContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(() => ({
    width: '100%',
    wordWrap: 'break-word',
  }))

export const ListContainer: React.FC<React.ComponentProps<typeof List>> =
  styled(List)(() => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    minHeight: 400,
  }))

export const BookmarksListContainer: React.FC<
  React.ComponentProps<typeof ListContainer>
> = styled(ListContainer)(({ theme }) => ({
  ...(theme.container?.height === '100%'
    ? { minHeight: 360, height: 360, flexGrow: 1, overflow: 'auto' }
    : { minHeight: 440 }),
}))
export const BookmarkButtonContainer: React.FC<
  React.ComponentProps<typeof Box>
> = styled(Box)(({ theme }) => ({
  background: theme.vars.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  bottom: 0,
  padding: theme.spacing(0, 3, 3),
  zIndex: 2,
  position: 'sticky',
  width: '100%',
}))

export const EmptyContainer: React.FC<React.ComponentProps<typeof Box>> =
  styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    gap: theme.spacing(2),
  }))

export const ValidationAlert: React.FC<React.ComponentProps<typeof Alert>> =
  styled(Alert)(({ theme }) => ({
    backgroundColor: 'transparent',
    padding: 0,
    color: theme.vars.palette.text.primary,
    [`.${alertClasses.icon}`]: {
      padding: 0,
      color: theme.vars.palette.error.main,
    },
    [`.${alertClasses.message}`]: { padding: theme.spacing(0.25, 0, 0, 0) },
  }))

export const OptionsMenuButton: React.FC<
  React.ComponentProps<typeof IconButton>
> = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1.75),
  right: theme.spacing(2),
  '&:hover': {
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.04)`,
  },
}))
