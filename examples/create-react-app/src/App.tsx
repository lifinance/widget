import { LiFiWidget } from '@lifi/widget';
import './App.css';

function App() {
  return (
    <LiFiWidget
      config={{
        containerStyle: {
          border: `1px solid rgb(234, 234, 234)`,
          borderRadius: '16px',
        },
      }}
      integrator="cra-example"
    />
  );
}

export default App;
