import CloseIcon from '@mui/icons-material/CloseRounded';
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useTranslation } from 'react-i18next';
import { useDrawer } from '../../AppDrawerContext';

export const CloseDrawerButton = () => {
  const { t } = useTranslation();
  const { closeDrawer } = useDrawer();

  return (
    <Tooltip title={t('button.close')} enterDelay={400} arrow>
      <IconButton size="medium" onClick={closeDrawer}>
        <CloseIcon />
      </IconButton>
    </Tooltip>
  );
};
