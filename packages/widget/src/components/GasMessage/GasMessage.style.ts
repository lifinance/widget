import { alpha, styled, switchClasses } from '@mui/material'
import { Switch } from '../Switch.js'

export const InfoMessageSwitch = styled(Switch)(({ theme }) => ({
  [`.${switchClasses.switchBase}`]: {
    [`&.${switchClasses.checked}`]: {
      [`& + .${switchClasses.track}`]: {
        backgroundColor: alpha(theme.palette.info.main, 0.84),
        ...theme.applyStyles('light', {
          backgroundColor: theme.palette.info.main,
        }),
      },
    },
    [`&.Mui-focusVisible .${switchClasses.thumb}`]: {
      color: alpha(theme.palette.info.main, 0.84),
      ...theme.applyStyles('light', {
        color: theme.palette.info.main,
      }),
    },
  },
}))
