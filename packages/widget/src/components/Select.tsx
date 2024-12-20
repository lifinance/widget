import {
  Select as MuiSelect,
  inputBaseClasses,
  listItemIconClasses,
  outlinedInputClasses,
  selectClasses,
  styled,
} from '@mui/material'

export const Select = styled(MuiSelect, {
  shouldForwardProp: (prop) => prop !== 'dense',
})<{ dense?: boolean }>(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  [`.${inputBaseClasses.input}`]: {
    padding: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  [`.${selectClasses.icon}`]: {
    right: 10,
    color: theme.palette.text.primary,
  },
  [`.${listItemIconClasses.root}`]: {
    minWidth: 38,
  },
  [`.${outlinedInputClasses.notchedOutline}`]: {
    display: 'none',
  },
  ...theme.applyStyles('light', {
    backgroundColor: theme.palette.common.white,
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
