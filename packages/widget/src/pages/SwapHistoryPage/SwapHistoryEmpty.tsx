import { History as HistoryIcon } from '@mui/icons-material';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const SwapHistoryEmpty: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Container
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography fontSize={48}>
        <HistoryIcon fontSize="inherit" />
      </Typography>
      <Typography fontSize={18} fontWeight={700}>
        No recent swaps
      </Typography>
      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mt={2}
      >
        Swap history is only stored locally and will be deleted if you clear
        your browser data.
      </Typography>
    </Container>
  );
};
