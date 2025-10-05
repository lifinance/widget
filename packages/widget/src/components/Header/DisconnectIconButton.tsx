import { useAccountDisconnect } from '@lifi/wallet-management'
import type { Account } from '@lifi/wallet-provider'
import PowerSettingsNewRounded from '@mui/icons-material/PowerSettingsNewRounded'
import { IconButton } from '@mui/material'

export const DisconnectIconButton = ({ account }: { account: Account }) => {
  const disconnect = useAccountDisconnect()
  return (
    <IconButton
      size="medium"
      onClick={async (e) => {
        e.stopPropagation()
        await disconnect(account)
      }}
    >
      <PowerSettingsNewRounded />
    </IconButton>
  )
}
