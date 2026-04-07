import { styled, switchClasses } from '@mui/material'
import type React from 'react'
import { Switch } from '../Switch.js'

export const InfoMessageSwitch: React.FC<React.ComponentProps<typeof Switch>> =
  styled(Switch)(({ theme }) => ({
    [`.${switchClasses.switchBase}`]: {
      [`&.${switchClasses.checked}`]: {
        [`& + .${switchClasses.track}`]: {
          backgroundColor: theme.vars.palette.info.main,
          ...theme.applyStyles('dark', {
            backgroundColor: `rgba(${theme.vars.palette.info.mainChannel} / 0.84)`,
          }),
        },
      },
      [`&.Mui-focusVisible .${switchClasses.thumb}`]: {
        color: theme.vars.palette.info.main,
        ...theme.applyStyles('dark', {
          color: `rgba(${theme.vars.palette.info.mainChannel} / 0.84)`,
        }),
      },
    },
  }))
