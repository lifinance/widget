import type { BoxProps } from '@mui/material';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../../providers';
import { useExecutingRoutesIds } from '../../stores';
import { navigationRoutes } from '../../utils';
import { Card, CardTitle } from '../Card';
import { ActiveTransactionItem } from './ActiveTransactionItem';
import { ShowAllButton } from './ActiveTransactions.style';

export const ActiveTransactions: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { account } = useWallet();
  const executingRoutes = useExecutingRoutesIds(account.address);

  if (!executingRoutes?.length) {
    return null;
  }

  const handleShowAll = () => {
    navigate(navigationRoutes.activeTransactions);
  };

  const hasShowAll = executingRoutes?.length > 2;

  return (
    <Card variant="selected" selectionColor="secondary" {...props}>
      <CardTitle>{t('header.activeTransactions')}</CardTitle>
      <Stack spacing={1.5} pt={1.5} pb={hasShowAll ? 0 : 2}>
        {executingRoutes.slice(0, 2).map((routeId) => (
          <ActiveTransactionItem key={routeId} routeId={routeId} dense />
        ))}
      </Stack>
      {hasShowAll ? (
        <ShowAllButton disableRipple fullWidth onClick={handleShowAll}>
          {t('button.showAll')}
        </ShowAllButton>
      ) : null}
    </Card>
  );
};
