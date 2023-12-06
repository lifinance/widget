import { default as InfoRounded } from '@mui/icons-material/InfoRounded';
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
import { useSettingMonitor } from '../../hooks';
import { ResetButtonContainer } from './ResetSettingsButton.style';

export const ResetSettingsButton: React.FC = () => {
  const { t } = useTranslation();
  const { isCustomRouteSettings, reset } = useSettingMonitor();
  const [open, setOpen] = useState(false);

  const toggleDialog = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  const handleReset = () => {
    reset();
    toggleDialog();
  };

  if (!isCustomRouteSettings) {
    return null;
  }

  return (
    <Box px={3} mb={1}>
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
