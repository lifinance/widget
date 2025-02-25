import { Avatar, Box, Button, Tooltip, Typography } from '@mui/material'
import { usePrivy } from '@privy-io/react-auth'
import React from 'react'
import { shortenAddress } from '../utils/account'
import { AccountMenu } from './AccountMenu'

export function AccountButton() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const { user } = usePrivy()

  if (!user?.wallet?.address) {
    return null
  }

  return (
    <Box display="flex" gap={2}>
      <Tooltip title="Account settings">
        <Button
          onClick={handleClick}
          sx={{ ml: 2, color: 'black', display: 'flex', gap: 1 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              background: 'white',
              color: 'black',
            }}
          />
          <Typography variant="button">{shortenAddress(user.id)}</Typography>
        </Button>
      </Tooltip>
      <AccountMenu anchorEl={anchorEl} open={open} handleClose={handleClose} />
    </Box>
  )
}
