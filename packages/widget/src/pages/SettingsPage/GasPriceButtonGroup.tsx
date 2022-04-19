import { HelpOutline as HelpOutlineIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SwapFormKey } from '../../providers/SwapFormProvider';
import { Button, ButtonGroup } from './GasPriceButtonGroup.style';

export const GasPriceButtonGroup = () => {
  const { t } = useTranslation();
  const { setValue } = useFormContext();

  const value = useWatch({
    name: SwapFormKey.GasPrice,
  });

  const handleChange = (newValue: 'slow' | 'normal' | 'fast') => {
    setValue(SwapFormKey.GasPrice, newValue);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }} mb={1}>
        <HelpOutlineIcon sx={{ color: 'grey.500' }} />
        <Typography
          variant="subtitle1"
          color="text.secondary"
          lineHeight="normal"
          ml={1}
        >
          {t(`settings.gasPrice.title`)}
        </Typography>
      </Box>
      <ButtonGroup size="large">
        <Button
          key="slow"
          disableElevation
          variant={value === 'slow' ? 'contained' : 'outlined'}
          onClick={() => handleChange('slow')}
        >
          {t(`settings.gasPrice.slow`)}
        </Button>
        <Button
          key="normal"
          disableElevation
          variant={value === 'normal' ? 'contained' : 'outlined'}
          onClick={() => handleChange('normal')}
        >
          {t(`settings.gasPrice.normal`)}
        </Button>
        <Button
          key="fast"
          disableElevation
          variant={value === 'fast' ? 'contained' : 'outlined'}
          onClick={() => handleChange('fast')}
        >
          {t(`settings.gasPrice.fast`)}
        </Button>
      </ButtonGroup>
    </Box>
  );
};
