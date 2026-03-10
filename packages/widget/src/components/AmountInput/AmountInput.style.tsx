import {
  Box,
  InputBase,
  inputBaseClasses,
  FormControl as MuiFormControl,
  styled,
  Typography,
} from '@mui/material'
import { CardTitle } from '../Card/CardTitle.js'
import { InputCard } from '../Card/InputCard.js'

export const AmountInputCard = styled(InputCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  padding: theme.spacing(3),
}))

export const maxInputFontSize = 40
export const minInputFontSize = 14

export const FormControl = styled(MuiFormControl)(() => ({
  flex: 1,
}))

export const Input = styled(InputBase)(() => ({
  fontSize: 40,
  fontWeight: 700,
  boxShadow: 'none',
  lineHeight: 1.4,
  [`.${inputBaseClasses.input}`]: {
    padding: 0,
    height: 'auto',
  },
  '& input[type="number"]::-webkit-outer-spin-button, & input[type="number"]::-webkit-inner-spin-button':
    {
      WebkitAppearance: 'none',
      margin: 0,
    },
  '& input[type="number"]': {
    MozAppearance: 'textfield',
  },
  [`&.${inputBaseClasses.disabled}`]: {
    color: 'inherit',
  },
  [`.${inputBaseClasses.input}.${inputBaseClasses.disabled}`]: {
    WebkitTextFillColor: 'unset',
  },
}))

export const AmountInputCardTitle = styled(CardTitle)(() => ({
  padding: 0,
  fontSize: 14,
  fontWeight: 700,
  lineHeight: 1.4286,
}))

export const AmountInputCardHeader = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}))

export const TokenAmountRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
}))

export const LabelRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
}))

export const LabelDescriptionColumn = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  gap: theme.spacing(0.5),
}))

export const DescriptionRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  width: '100%',
}))

export const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.3333,
  color: theme.vars.palette.text.secondary,
  whiteSpace: 'nowrap',
}))

export const BalanceText = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.3333,
  color: theme.vars.palette.text.primary,
  whiteSpace: 'nowrap',
}))

export const PercentageRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  width: '100%',
}))
