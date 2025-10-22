import { LiFiWidget } from '@lifi/widget'
import { BitcoinProvider } from '@lifi/widget-provider-bitcoin'
import { EthereumProvider } from '@lifi/widget-provider-ethereum'
import { SolanaProvider } from '@lifi/widget-provider-solana'
import { SuiProvider } from '@lifi/widget-provider-sui'
import { Box, CssBaseline } from '@mui/material'
import type { NFTNetwork } from './components/NFTOpenSea/index.js'
import {
  NFTOpenSea,
  NFTOpenSeaSecondary,
  openSeaContractTool,
} from './components/NFTOpenSea/index.js'
import { widgetConfig } from './config.js'
import './index.css'

export const App = () => {
  const pathnameParams = window.location.pathname.substring(1).split('/')

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
      }}
    >
      <CssBaseline />
      <Box
        sx={{
          flex: 1,
          margin: 'auto',
        }}
      >
        <LiFiWidget
          providers={[
            EthereumProvider(),
            SuiProvider(),
            SolanaProvider(),
            BitcoinProvider(),
          ]}
          contractComponent={
            <NFTOpenSea
              network={pathnameParams[0] as NFTNetwork}
              contractAddress={pathnameParams[1]}
              tokenId={pathnameParams[2]}
            />
          }
          contractSecondaryComponent={
            <NFTOpenSeaSecondary
              network={pathnameParams[0] as NFTNetwork}
              contractAddress={pathnameParams[1]}
              tokenId={pathnameParams[2]}
            />
          }
          contractCompactComponent={
            <NFTOpenSeaSecondary
              network={pathnameParams[0] as NFTNetwork}
              contractAddress={pathnameParams[1]}
              tokenId={pathnameParams[2]}
            />
          }
          contractTool={openSeaContractTool}
          config={widgetConfig}
          integrator={widgetConfig.integrator}
          open
        />
      </Box>
    </Box>
  )
}
