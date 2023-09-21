import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../../components/Dialog';
import { useTools } from '../../hooks';
import { useWidgetConfig } from '../../providers';
import {
  defaultConfigurableSettings,
  setDefaultSettings,
  useSettingsStore,
} from '../../stores';
import { ResetButtonContainer } from './ResetSettingsButton.style';
import { InfoRounded } from '@mui/icons-material';
import { shallow } from 'zustand/shallow';

export const ResetSettingsButton: React.FC = () => {
  const [enabledBridges, enabledExchanges, routePriority, slippage, gasPrice] =
    useSettingsStore(
      (state) => [
        state.enabledBridges,
        state.enabledExchanges,
        state.routePriority,
        state.slippage,
        state.gasPrice,
      ],
      shallow,
    );

  const { t } = useTranslation();
  const { tools } = useTools();
  const config = useWidgetConfig();
  const resetSettings = useSettingsStore((state) => state.reset);
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  const handleReset = () => {
    if (tools) {
      resetSettings(
        config,
        tools.bridges.map((tool) => tool.key),
        tools.exchanges.map((tool) => tool.key),
      );

      setDefaultSettings(config);
    }
    toggleDialog();
  };

  const isSlippageChanged = config.slippage
    ? Number(slippage) !== config.slippage * 100
    : slippage !== defaultConfigurableSettings.slippage;

  const isRoutePriorityChanged = config.routePriority
    ? routePriority !== config.routePriority
    : routePriority !== defaultConfigurableSettings.routePriority;

  const isGasPriceChanged = gasPrice !== defaultConfigurableSettings.gasPrice;

  const isCustomRouteSettings =
    tools?.bridges?.length !== enabledBridges?.length ||
    tools?.exchanges?.length !== enabledExchanges?.length ||
    isSlippageChanged ||
    isRoutePriorityChanged ||
    isGasPriceChanged;

  if (!isCustomRouteSettings) {
    return null;
  }

  return (
    <Box px={3} mt={1.5} mb={1}>
      <ResetButtonContainer>
        <Box display="flex" marginBottom="12px">
          <InfoRounded
            sx={{
              marginRight: '8px',
            }}
          />
          <Box fontSize={14}>{t(`settings.resetSettings`)}</Box>
        </Box>
        <Button onClick={toggleDialog} fullWidth>
          {t('button.resetSettings')}
        </Button>

        <Dialog open={open} onClose={toggleDialog}>
          <DialogTitle>{t('warning.title.resetSettings')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('warning.message.resetSettings')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleDialog}>{t('button.cancel')}</Button>
            <Button variant="contained" onClick={handleReset} autoFocus>
              {t('button.reset')}
            </Button>
          </DialogActions>
        </Dialog>
      </ResetButtonContainer>
    </Box>
  );
};
