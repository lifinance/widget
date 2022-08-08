import { Box, Tooltip, Typography } from '@mui/material';
import { version } from '../../config/version';
import { LiFiLogo } from '../LiFiLogo';
import { Link } from './PoweredBy.style';

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
      }}
    >
      <Tooltip title={`v${version}`} placement="top" enterDelay={5000} arrow>
        <Link
          href="https://li.fi"
          target="_blank"
          underline="none"
          color="text.primary"
        >
          <Typography color="text.secondary" fontSize={12} px={0.5}>
            Powered by
          </Typography>
          <LiFiLogo variant="full" style={{ height: 16, width: 42 }} />
        </Link>
      </Tooltip>
    </Box>
  );
};
