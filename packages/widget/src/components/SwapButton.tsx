import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import {
  usePriorityAccount,
  usePriorityConnector,
  usePriorityIsActivating,
  usePriorityIsActive,
} from '../hooks/connectorHooks';

export const Button = styled(LoadingButton)({
  textTransform: 'none',
  borderRadius: 0,
  padding: '12px 16px',
});

export const SwapButton = () => {
  const { t } = useTranslation();
  const connector = usePriorityConnector();
  const isActive = usePriorityIsActive();
  const isActivating = usePriorityIsActivating();
  const account = usePriorityAccount();

  return (
    <Button
      variant="contained"
      disableElevation
      fullWidth
      color={isActive ? 'primary' : 'success'}
      onClick={isActive ? undefined : async () => connector.activate()}
      loading={isActivating}
    >
      {isActive ? t(`swap.submit`) : t(`swap.connectWallet`)}
    </Button>
  );
};
