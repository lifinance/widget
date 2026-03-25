import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  styled,
  Typography,
} from '@mui/material'

export const OptionsRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  paddingTop: theme.spacing(1.5),
}))

export const OptionCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  borderRadius: 16,
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
  backgroundColor:
    theme.vars?.palette?.background?.paper ?? theme.palette.background.paper,
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor:
      theme.vars?.palette?.action?.hover ?? theme.palette.action.hover,
  },
}))

/** Mesh / exchange linking — disabled until the flow is wired up */
export const OptionCardComingSoon = styled(Card)(({ theme }) => ({
  cursor: 'not-allowed',
  borderRadius: 16,
  boxShadow: '0px 2px 8px 0px rgba(0, 0, 0, 0.04)',
  backgroundColor:
    theme.vars?.palette?.background?.paper ?? theme.palette.background.paper,
  opacity: 0.55,
  pointerEvents: 'none',
  userSelect: 'none',
}))

export const OptionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  width: '100%',
}))

export const GenericIconWrap = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.08)'
      : 'rgba(0, 0, 0, 0.04)',
  color: theme.vars?.palette?.text?.primary ?? theme.palette.text.primary,
  '& .MuiSvgIcon-root': {
    fontSize: 22,
  },
}))

export const StackAvatar = styled(Avatar)(({ theme }) => ({
  width: 24,
  height: 24,
  fontSize: 10,
  fontWeight: 700,
  border: `2px solid ${theme.vars?.palette?.background?.paper ?? theme.palette.background.paper}`,
}))

export const OptionTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: 16,
  lineHeight: '20px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

export const OptionTextCell = styled(Box)({
  flex: 1,
  minWidth: 0,
})

export const ChainAvatarGroup = styled(AvatarGroup)({
  flexShrink: 0,
  '& .MuiAvatar-root': {
    width: 24,
    height: 24,
    fontSize: 10,
    borderWidth: 2,
  },
})

export const ExchangeAvatarsWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  flexShrink: 0,
  paddingRight: theme.spacing(1),
}))

export const PaymentMarksWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  flexShrink: 0,
}))

export const PaymentMarkMastercard = styled(Box)({
  width: 24,
  height: 24,
  borderRadius: 4,
  background: 'linear-gradient(135deg, #EB001B 0%, #F79E1B 100%)',
  flexShrink: 0,
})

export const PaymentMarkVisa = styled(Box)({
  width: 24,
  height: 24,
  borderRadius: 4,
  backgroundColor: '#1434CB',
  flexShrink: 0,
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 2,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 10,
    height: 14,
    borderRadius: '2px',
    backgroundColor: '#F7B600',
  },
})

export const TransferAvatarEth = styled(StackAvatar)({
  backgroundColor: '#627EEA',
  zIndex: 4,
})

export const TransferAvatarBase = styled(StackAvatar)({
  backgroundColor: '#0052FF',
  zIndex: 3,
})

export const TransferAvatarPoly = styled(StackAvatar)({
  backgroundColor: '#8247E5',
  zIndex: 2,
})

export const TransferAvatarOp = styled(StackAvatar)({
  backgroundColor: '#FF0420',
  zIndex: 1,
})

export const ExchangeAvatarCoinbase = styled(StackAvatar)({
  backgroundColor: '#0052FF',
  zIndex: 2,
  marginRight: -8,
})

export const ExchangeAvatarBinance = styled(StackAvatar)({
  backgroundColor: '#F0B90B',
  color: '#000',
  zIndex: 1,
})
