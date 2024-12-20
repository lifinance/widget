import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import WalletIcon from '@mui/icons-material/Wallet'
import { Box } from '@mui/material'
import { useAccount, useConnect, useConnectors, useDisconnect } from 'wagmi'
import { shortenAddress } from '../../utils/shortenAddress'
import { ConnectionWalletButtonBase } from './WidgetView.style'

export const ConnectWalletButton = () => {
  const connectors = useConnectors()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const account = useAccount()

  return account.isConnected && account.address ? (
    <ConnectionWalletButtonBase
      variant="contained"
      endIcon={<PowerSettingsNewIcon />}
      onClick={() => disconnect()}
    >
      <Box
        sx={{
          pr: 1,
        }}
      >
        {shortenAddress(account.address)}
      </Box>
      |
      <Box
        sx={{
          pl: 1,
        }}
      >
        Disconnect
      </Box>
    </ConnectionWalletButtonBase>
  ) : (
    <ConnectionWalletButtonBase
      variant="contained"
      endIcon={<WalletIcon />}
      onClick={() => connect({ connector: connectors[0] })}
    >
      Connect wallet
    </ConnectionWalletButtonBase>
  )
}
