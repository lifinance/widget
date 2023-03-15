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
              tokenId="29014243319676196359126730877655047555107173670640133741458013584582074433537"
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
