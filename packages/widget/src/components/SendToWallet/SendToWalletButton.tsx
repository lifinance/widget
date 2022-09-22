import { WalletOutlined as WalletOutlinedIcon } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../../providers';
import { useSettings } from '../../stores';
import { useSendToWalletStore } from './store';

export const SendToWalletButton: React.FC = () => {
  const { t } = useTranslation();
  const { account } = useWallet();
  const { showDestinationWallet } = useSettings(['showDestinationWallet']);
  const { showSendToWallet, toggleSendToWallet } = useSendToWalletStore();

  if (!showDestinationWallet || !account.isActive) {
    return null;
  }

  return (
    <Tooltip
      title={t('swap.sendToWallet')}
      placement="bottom-end"
      enterDelay={500}
      enterNextDelay={500}
      arrow
    >
      <Button
        variant={showSendToWallet ? 'contained' : 'text'}
        onClick={toggleSendToWallet}
        sx={{
          minWidth: 48,
          marginLeft: 1,
        }}
      >
        <WalletOutlinedIcon />
      </Button>
    </Tooltip>
  );
};
