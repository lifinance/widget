import {
  getConnectorIcon,
  useAccount,
  useAccountDisconnect,
  useWalletMenu,
} from '@lifi/wallet-management'
import type { Account } from '@lifi/widget-provider'
import { Avatar, Box, Button, Chip, Typography } from '@mui/material'

function shortenAddress(address?: string) {
  if (!address) {
    return ''
  }
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function WalletHeader() {
  const { account, accounts } = useAccount()
  const { openWalletMenu } = useWalletMenu()

  return (
    <Box
      px={3}
      py={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid #EEEEEE"
      bgcolor="#FAFAFA"
    >
      <Typography fontWeight={700} fontSize={20}>
        Widget Light — Host
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        {accounts.map((acc) => (
          <ConnectedAccount key={acc.address} account={acc} />
        ))}
        <Button
          variant={account.isConnected ? 'outlined' : 'contained'}
          size="small"
          disableElevation
          onClick={() => openWalletMenu()}
        >
          {account.isConnected ? 'Connect Another' : 'Connect Wallet'}
        </Button>
      </Box>
    </Box>
  )
}

function ConnectedAccount({ account }: { account: Account }) {
  const disconnect = useAccountDisconnect()

  return (
    <Chip
      avatar={
        <Avatar
          src={getConnectorIcon(account.connector)}
          alt={account.connector?.name}
          sx={{ width: 20, height: 20 }}
        />
      }
      label={
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography fontSize={13} fontWeight={500}>
            {shortenAddress(account.address)}
          </Typography>
          <Typography fontSize={11} color="text.secondary">
            ({account.chainType})
          </Typography>
        </Box>
      }
      onDelete={() => disconnect(account)}
      variant="outlined"
      size="medium"
    />
  )
}
