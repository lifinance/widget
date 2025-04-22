import { Switch as MuiSwitch, styled, switchClasses } from '@mui/material'

export const Switch = styled(MuiSwitch)(({ theme }) => ({
  width: 42,
  height: 24,
  padding: 0,
  [`.${switchClasses.switchBase}`]: {
    padding: 0,
    margin: theme.spacing(0.25),
    transitionDuration: theme.transitions.duration.standard,
    [`&.${switchClasses.checked}`]: {
      transform: 'translateX(18px)',
      color: theme.vars.palette.common.white,
      [`& + .${switchClasses.track}`]: {
        backgroundColor: theme.vars.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      [`&.${switchClasses.disabled} + .${switchClasses.track}`]: {
        opacity: 0.5,
      },
    },
    [`&.Mui-focusVisible .${switchClasses.thumb}`]: {
      color: theme.vars.palette.primary.main,
      border: '6px solid',
      borderColor: theme.vars.palette.common.white,
    },
    [`&.${switchClasses.disabled} .${switchClasses.thumb}`]: {
      color: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.12)`,
    },
    [`&.${switchClasses.disabled} + .${switchClasses.track}`]: {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  [`.${switchClasses.thumb}`]: {
    boxSizing: 'border-box',
    width: 20,
    height: 20,
  },
  [`.${switchClasses.track}`]: {
    borderRadius: 24 / 2,
    backgroundColor: `rgba(${theme.vars.palette.common.onBackgroundChannel} / 0.16)`,
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: theme.transitions.duration.standard,
    }),
  },
}))
