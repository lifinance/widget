import InfoIcon from '@mui/icons-material/Info';
import { Card } from '../Card';
import { Alert } from './DesignControls';

export const FontEmbedPrompt = () => {
  const googleFontEmbedMessage = 'You need to embed the font';

  return (
    <Card
      sx={{
        paddingX: 2,
        paddingY: 0.5,
      }}
    >
      <Alert
        icon={<InfoIcon fontSize="inherit" />}
        severity="info"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {googleFontEmbedMessage}
      </Alert>
    </Card>
  );
};
