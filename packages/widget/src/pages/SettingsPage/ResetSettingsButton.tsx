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
import { useSettingsStore } from '../../stores';
import { ResetButtonContainer } from './ResetSettingsButton.style';
import { InfoRounded } from '@mui/icons-material';

export const ResetSettingsButton: React.FC = () => {
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
    }
    toggleDialog();
  };

  const isCustomRouteSettings = true;

  return (
    <Box px={3} mt={1.5} mb={1}>
      <ResetButtonContainer isCustomRouteSettings={isCustomRouteSettings}>
        {isCustomRouteSettings && (
          <Box display={'flex'} marginBottom={'12px'}>
            <InfoRounded
              sx={{
                marginRight: '8px',
              }}
            />
            <Box marginTop={'2px'} fontSize={14}>
              {t(`settings.resetSettings`)}
            </Box>
          </Box>
        )}
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
