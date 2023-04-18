import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Box, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { InsuraceLogo } from '../../icons';
import { RouteExecutionStatus } from '../../stores';
import { Card, CardLabel, CardLabelTypography } from '../Card';
import { Switch } from '../Switch';
import type { InsuranceCardProps } from './types';

export const InsuranceCard: React.FC<InsuranceCardProps> = ({
  status,
  feeAmountUsd,
  insuranceCoverageId,
  onChange,
  ...props
}) => {
  const { t } = useTranslation();

  return (
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
      <Box display="flex" alignItems="center">
        <Typography fontSize={12}>
          {status === RouteExecutionStatus.Idle
            ? 'Get 100% coverage for lost tokens.'
            : '100% coverage for lost tokens.'}
        </Typography>
        <Link
          href={
            status === RouteExecutionStatus.Idle
              ? 'https://docs.insurace.io/landing-page/documentation/cover-products/bridge-cover/li.fi'
              : `https://app.insurace.io/bridge-cover?search=${insuranceCoverageId}`
          }
          target="_blank"
          underline="none"
          color="text.primary"
        >
          <Typography px={0.5} color="primary" fontSize={12} fontWeight={600}>
            {status === RouteExecutionStatus.Idle
              ? 'Learn more'
              : 'View coverage'}
          </Typography>
        </Link>
      </Box>
    </Card>
  );
};
