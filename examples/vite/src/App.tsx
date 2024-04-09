/* eslint-disable no-console */
import { LiFiWidget } from '@lifi/widget';
import { Box } from '@mui/material';
import { WalletHeader } from './components/WalletHeader';

export function App() {
  return (
    <Box>
      <WalletHeader />
      <LiFiWidget
        integrator="vite-example"
        config={{
          integrator: 'vite-example',
          theme: {
            container: {
              border: `1px solid rgb(234, 234, 234)`,
              borderRadius: '16px',
            },
          },
        }}
      />
    </Box>
  );
}
