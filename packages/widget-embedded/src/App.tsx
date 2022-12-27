import { LiFiWidget } from '@lifi/widget';
import { Box, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { NFTOpenSea, openSeaContractTool } from './components/NFTOpenSea';
import { WidgetEvents } from './components/WidgetEvents';
import { widgetConfig } from './config';
import './index.css';

export const App = () => {
  const [searchParams] = useState(() =>
    Object.fromEntries(new URLSearchParams(window?.location.search)),
  );
  return (
    <Box display="flex" height="100vh">
      <WidgetEvents />
      <CssBaseline />
      <Box flex={1} margin="auto">
        <LiFiWidget
          contractComponent={
            <NFTOpenSea
              network="matic"
              contractAddress="0x2953399124f0cbb46d2cbacd8a89cf0599974963"
              tokenId="64502972783035859128289628429895945738065380838425747288102663476761386287105"
            />
          }
          contractTool={openSeaContractTool}
          config={widgetConfig}
          open
        />
      </Box>
    </Box>
  );
};
