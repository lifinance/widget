import { LiFiWidget } from '@lifi/widget';

function App() {
  return (
    <LiFiWidget
      config={{
        theme: {
          container: {
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
            borderRadius: '16px',
          },
        },
      }}
      integrator="cra-example"
    />
  );
}

export default App;
