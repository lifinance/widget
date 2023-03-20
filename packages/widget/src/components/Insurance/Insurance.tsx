import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import type { BoxProps } from '@mui/material';
import { Box, Collapse, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { InsuraceLogo } from '../../icons';
import { RouteExecutionStatus } from '../../stores';
import { Card, CardLabel, CardLabelTypography } from '../Card';
import { Switch } from '../Switch';

export const Insurance: React.FC<
  {
    available?: boolean;
    insurableRouteId?: string;
    feeAmountUsd?: string;
    status?: RouteExecutionStatus;
    onChange?: (
      event: React.ChangeEvent<HTMLInputElement>,
      checked: boolean,
    ) => void;
  } & Omit<BoxProps, 'onChange'>
> = ({
  status,
  feeAmountUsd,
  insurableRouteId,
  available,
  onChange,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Collapse
      timeout={225}
      in={available}
      unmountOnExit
      mountOnEnter
      appear={status === RouteExecutionStatus.Idle}
    >
      <Card selectionColor="secondary" indented {...props}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <CardLabel type={'insurance'}>
            <VerifiedUserIcon fontSize="inherit" />
            <CardLabelTypography type="icon">
              {status === RouteExecutionStatus.Idle
                ? t(`swap.tags.insurance`)
                : t(`swap.tags.insured`)}
            </CardLabelTypography>
          </CardLabel>
          <InsuraceLogo />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Typography fontSize={24} fontWeight={700} lineHeight={1}>
            {t('format.currency', {
              value: feeAmountUsd,
            })}
          </Typography>
          {status === RouteExecutionStatus.Idle ? (
            <Switch onChange={onChange} />
          ) : null}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontSize={12}>
            Get 100% coverage for lost tokens.
          </Typography>
        </Box>
      </Card>
    </Collapse>
  );
};
