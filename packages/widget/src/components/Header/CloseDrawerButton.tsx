import { CloseRounded } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDrawer } from '../../AppDrawerContext.js';

export const CloseDrawerButton = () => {
  const { t } = useTranslation();
  const { closeDrawer } = useDrawer();

  return (
    <Tooltip title={t('button.close')} enterDelay={400} arrow>
      <IconButton size="medium" onClick={closeDrawer}>
        <CloseRounded />
      </IconButton>
    </Tooltip>
  );
};
