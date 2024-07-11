import { Layers } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IconTypography } from '../IconTypography.js';
import type { RouteCardEssentialsProps } from './types.js';

export const RouteCardEssentialsExpanded: React.FC<
  RouteCardEssentialsProps
> = ({ route }) => {
  const { t } = useTranslation();
  return (
    <Box flex={1} mt={2}>
      <Box display="flex" alignItems="center">
        <IconTypography ml={1} mr={3}>
          <Layers />
        </IconTypography>
        <Typography
          fontSize={16}
          color="text.primary"
          fontWeight="600"
          lineHeight={1.125}
        >
          {route.steps.length}
        </Typography>
      </Box>
      <Box mt={0.5} ml={7}>
        <Typography
          fontSize={12}
          color="text.secondary"
          fontWeight="500"
          lineHeight={1.125}
        >
          {t(`tooltip.numberOfSteps`)}
        </Typography>
      </Box>
    </Box>
  );
};
