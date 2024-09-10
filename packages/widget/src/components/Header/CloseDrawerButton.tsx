import { CloseRounded } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDrawer } from '../../AppDrawerContext.js';
import { useHasExternalWalletProvider } from '../../providers/WalletProvider/useHasExternalWalletProvider.js';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';

interface CloseDrawerButtonProps {
  header?: 'navigation' | 'wallet';
}

export const CloseDrawerButton = ({ header }: CloseDrawerButtonProps) => {
  const { t } = useTranslation();
  const { subvariant } = useWidgetConfig();
  const { closeDrawer } = useDrawer();
  const { hasExternalProvider } = useHasExternalWalletProvider();

  const showInNavigationHeader =
    header === 'navigation' && (hasExternalProvider || subvariant === 'split');

  const showInWalletHeader = header === 'wallet' && subvariant !== 'split';

  return showInNavigationHeader || showInWalletHeader ? (
    <Tooltip title={t('button.close')}>
      <IconButton size="medium" onClick={closeDrawer}>
        <CloseRounded />
      </IconButton>
    </Tooltip>
  ) : null;
};
