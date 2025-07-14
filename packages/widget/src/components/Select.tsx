import {
  inputBaseClasses,
  listItemIconClasses,
  Select as MuiSelect,
  outlinedInputClasses,
  selectClasses,
  styled,
} from '@mui/material'

export const Select = styled(MuiSelect, {
  shouldForwardProp: (prop) => prop !== 'dense',
})<{ dense?: boolean }>(({ theme }) => ({
  backgroundColor: theme.vars.palette.common.white,
  [`.${inputBaseClasses.input}`]: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  [`.${selectClasses.icon}`]: {
    right: 10,
    color: theme.vars.palette.text.primary,
  },
  [`.${listItemIconClasses.root}`]: {
    minWidth: 38,
  },
  [`.${outlinedInputClasses.notchedOutline}`]: {
    display: 'none',
  },
  ...theme.applyStyles('dark', {
    backgroundColor: theme.vars.palette.background.paper,
  }),
  variants: [
    {
      props: ({ dense }) => dense,
      style: {
        [`.${inputBaseClasses.input}`]: {
          padding: theme.spacing(1.625, 2, 1.5, 2),
        },
      },
    },
  ],
}))
