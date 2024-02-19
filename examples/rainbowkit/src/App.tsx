import { LiFiWidget } from '@lifi/widget';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function App() {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: 12,
        }}
      >
        <ConnectButton chainStatus="none" />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <LiFiWidget
          config={{
            containerStyle: {
              boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
              borderRadius: '16px',
            },
          }}
          integrator="rainbowkit-example"
        />
      </div>
    </div>
  );
}
