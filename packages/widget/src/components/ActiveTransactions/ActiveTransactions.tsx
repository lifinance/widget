import type { BoxProps } from '@mui/material';
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useExecutingRoutesIds } from '../../stores/routes/useExecutingRoutesIds.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { Card } from '../Card/Card.js';
import { CardTitle } from '../Card/CardTitle.js';
import { ActiveTransactionItem } from './ActiveTransactionItem.js';
import { ShowAllButton } from './ActiveTransactions.style.js';

export const ActiveTransactions: React.FC<BoxProps> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const executingRoutes = useExecutingRoutesIds();

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
