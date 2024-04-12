import { LiFiWidget } from '@lifi/widget';
import { Box, CssBaseline } from '@mui/material';
import type { NFTNetwork } from './components/NFTOpenSea';
import {
  NFTOpenSea,
  NFTOpenSeaSecondary,
  openSeaContractTool,
} from './components/NFTOpenSea';
import { widgetConfig } from './config';
import './index.css';

export const App = () => {
  const pathnameParams = window.location.pathname.substring(1).split('/');

  return (
    <Box display="flex" height="100vh">
      <CssBaseline />
      <Box flex={1} margin="auto">
        <LiFiWidget
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
  );
};
