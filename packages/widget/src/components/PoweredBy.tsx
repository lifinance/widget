import { Box, Typography } from '@mui/material';
import { ReactComponent as LiFiFullLogo } from '../icons/LiFiLogoFull.svg';

export const PoweredBy: React.FC = () => {
  return (
    <Box
      px={3}
      pt={2}
      pb={2}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography color="text.secondary" fontSize={12} px={0.5}>
          Powered by
        </Typography>
        <LiFiFullLogo style={{ height: 16, width: 42 }} />
      </Box>
    </Box>
  );
};
