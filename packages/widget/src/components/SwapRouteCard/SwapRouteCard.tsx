import { Box, BoxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card, Label } from './SwapRouteCard.style';
import { SwapRouteCardProps } from './types';

export const SwapRouteCard: React.FC<SwapRouteCardProps & BoxProps> = ({
  amount,
  token,
  time,
  gas,
  active,
  type,
  ...other
}) => {
  const { t } = useTranslation();
  return (
    <Card active={active} {...other}>
      <Label active={active} mb={2}>
        {type}
      </Label>
      <Typography fontSize={32} fontWeight="bold" lineHeight="normal">
        {amount}
      </Typography>
      <Typography fontSize={14} mb={2} color="text.secondary">
        {token}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography fontSize={18} fontWeight="500">
            {gas}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            {t(`swap.gas`)}
          </Typography>
        </Box>
        <Box>
          <Typography fontSize={18} fontWeight="500">
            ~{time}
          </Typography>
          <Typography fontSize={12} color="text.secondary">
            {t(`swap.minutes`)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
