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
            backgroundColor: `color-mix(in srgb, ${theme.vars.palette.info.main} 84%, transparent)`,
          }),
        },
      },
      [`&.Mui-focusVisible .${switchClasses.thumb}`]: {
        color: theme.vars.palette.info.main,
        ...theme.applyStyles('dark', {
          color: `color-mix(in srgb, ${theme.vars.palette.info.main} 84%, transparent)`,
        }),
      },
    },
  }))
