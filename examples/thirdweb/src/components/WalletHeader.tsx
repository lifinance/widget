import { ChainType, useAvailableChains } from '@lifi/widget'
import { Box, Typography } from '@mui/material'
import { ConnectButton, darkTheme } from 'thirdweb/react'
import { type Wallet, createWallet, inAppWallet } from 'thirdweb/wallets'
import { useConnect, useDisconnect, useReconnect } from 'wagmi'
import { client } from '../config/thirdweb'
import { convertChainsToThirdWebChains } from '../utils/chains'

export function WalletHeader() {
  const { chains } = useAvailableChains()
  const { reconnect } = useReconnect()
  const { disconnect } = useDisconnect()
  const { connect, connectors } = useConnect()

  const customTheme = darkTheme({
    fontFamily: 'Inter var,Inter,sans-serif',
  })

  const evmChains =
    chains?.filter((chain) => chain.chainType === ChainType.EVM) || []
  const thirdWebChains = convertChainsToThirdWebChains(evmChains)

  const handleConnect = (wallet: Wallet) => {
    if (wallet.id === 'inApp') {
      reconnect()
    } else {
      const connector = connectors.find(
        (connector) => connector.id === wallet.id
      )
      console.log('about to connect to', { connector })
      if (connector) {
        connect({
          connector,
        })
      }
    }
  }

  return (
    <Box
      p={2}
      mb={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid #EEE"
    >
      <Typography px={2} fontWeight={600} fontSize={24}>
        LI.FI Widget + Thirdweb Example
      </Typography>
      <Box display="flex" alignItems="center">
        <ConnectButton
          client={client}
          theme={customTheme}
          connectButton={{
            style: {
              fontFamily: 'Inter var,Inter,sans-serif',
            },
            label: 'Connect wallet',
          }}
          wallets={[
            inAppWallet(),
            createWallet('io.metamask'),
            createWallet('com.coinbase.wallet'),
          ]}
          chains={thirdWebChains}
          onConnect={handleConnect}
          onDisconnect={() => disconnect()}
          showAllWallets
        />
      </Box>
    </Box>
  )
}
