import {
  Box,
  InputBase,
  inputBaseClasses,
  FormControl as MuiFormControl,
  styled,
} from '@mui/material'
import { CardTitle } from '../Card/CardTitle.js'

export const maxInputFontSize = 24
export const minInputFontSize = 14

export const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
}))

export const FormControl = styled(MuiFormControl)(() => ({
  height: 40,
}))

export const Input = styled(InputBase)(({ theme }) => ({
  fontSize: 24,
  fontWeight: 700,
  boxShadow: 'none',
  lineHeight: 1.5,
  [`.${inputBaseClasses.input}`]: {
    height: 24,
    padding: theme.spacing(0, 0, 0, 2),
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

export const AmountInputCardTitle = styled(CardTitle)(({ theme }) => ({
  padding: theme.spacing(2, 0, 0, 0),
}))

export const AmountInputCardHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0, 2, 0, 2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'start',
  height: 30,
}))
