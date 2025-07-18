import type { IconButtonProps } from '@mui/material'
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { Trans } from 'react-i18next'

const getProgressValue = (updatedAt: number, timeToUpdate: number) =>
  updatedAt ? Math.min(100, ((Date.now() - updatedAt) / timeToUpdate) * 100) : 0

const getSecondsToUpdate = (updatedAt: number, timeToUpdate: number) =>
  Math.max(Math.round((timeToUpdate - (Date.now() - updatedAt)) / 1000), 0)

export const ProgressToNextUpdate: React.FC<
  {
    updatedAt: number
    timeToUpdate: number
    isLoading?: boolean
  } & IconButtonProps
> = ({ updatedAt, timeToUpdate, isLoading, onClick, ...other }) => {
  const [value, setValue] = useState(() =>
    getProgressValue(updatedAt, timeToUpdate)
  )

  useEffect(() => {
    setValue(getProgressValue(updatedAt, timeToUpdate))
    const id = setInterval(() => {
      const time = getProgressValue(updatedAt, timeToUpdate)
      setValue(time)
      if (time >= 100) {
        clearInterval(id)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [timeToUpdate, updatedAt])

  useEffect(() => {
    if (isLoading) {
      setValue(0)
    }
  }, [isLoading])

  return (
    <IconButton onClick={onClick} disabled={isLoading} {...other}>
      <Tooltip
        title={
          <Trans
            i18nKey="tooltip.progressToNextUpdate"
            values={{
              value: getSecondsToUpdate(updatedAt, timeToUpdate),
            }}
            // biome-ignore lint/correctness/useJsxKeyInIterable: allowed in react-i18next
            components={[<br />]}
          />
        }
      >
        <Box
          sx={{
            display: 'grid',
            position: 'relative',
            placeItems: 'center',
            width: 24,
            height: 24,
          }}
        >
          <CircularProgress
            variant="determinate"
            size={24}
            value={100}
            sx={(theme) => ({
              position: 'absolute',
              color: theme.vars.palette.grey[300],
              ...theme.applyStyles('dark', {
                color: theme.vars.palette.grey[800],
              }),
            })}
          />
          <CircularProgress
            variant={isLoading ? 'indeterminate' : 'determinate'}
            size={24}
            value={value}
            sx={(theme) => ({
              opacity: value === 100 && !isLoading ? 0.5 : 1,
              color: theme.vars.palette.primary.main,
              ...theme.applyStyles('dark', {
                color: theme.vars.palette.primary.light,
              }),
            })}
          />
        </Box>
      </Tooltip>
    </IconButton>
  )
}
