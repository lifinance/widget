import { Box } from '@mui/material';
import './App.css';
import { FormControls } from './components/FormControls.tsx';
import { WidgetView } from './components/WidgetView.tsx';

function App() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <FormControls />
      <WidgetView />
    </Box>
  );
}

export default App;
