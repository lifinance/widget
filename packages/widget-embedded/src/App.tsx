import { LiFiWidget } from '@lifi/widget';
import { Box, CssBaseline } from '@mui/material';
import { useState } from 'react';
import type { NFTNetwork } from './components/NFTOpenSea';
import { NFTOpenSea, openSeaContractTool } from './components/NFTOpenSea';
import { WidgetEvents } from './components/WidgetEvents';
import { widgetConfig } from './config';
import './index.css';

export const App = () => {
  const [searchParams] = useState(() =>
    Object.fromEntries(new URLSearchParams(window?.location.search)),
  );
  const pathnameParams = window.location.pathname.substring(1).split('/');
  // const {
  //   isLoading,
  //   imageUrl,
  //   collectonName,
  //   assetName,
  //   owner,
  //   token,
  //   contract,
  // } = useNFTOpenSea({
  //   network: pathnameParams[0] as NFTNetwork,
  //   contractAddress: pathnameParams[1],
  //   tokenId: pathnameParams[2],
  // });

  return (
    <Box display="flex" height="100vh">
      <WidgetEvents />
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
          contractTool={openSeaContractTool}
          config={widgetConfig}
          integrator={widgetConfig.integrator}
          open
        />
      </Box>
    </Box>
  );
};
