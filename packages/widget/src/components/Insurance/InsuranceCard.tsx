import { VerifiedUser } from '@mui/icons-material';
import { Box, Collapse, Link, Typography } from '@mui/material';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { InsuraceLogo } from '../../icons/InsuraceLogo.js';
import { RouteExecutionStatus } from '../../stores/routes/types.js';
import { Card } from '../Card/Card.js';
import { CardLabel, CardLabelTypography } from '../Card/CardLabel.js';
import { Switch } from '../Switch.js';
import type { InsuranceCardProps } from './types.js';

export const InsuranceCard: React.FC<InsuranceCardProps> = ({
  status,
  feeAmountUsd,
  insuredAmount,
  insuredTokenSymbol,
  insuranceCoverageId,
  onChange,
  ...props
}) => {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);

  const handleSwitch = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setEnabled(checked);
    onChange?.(checked);
  };

  return (
    <Card selectionColor="secondary" indented {...props}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <CardLabel type={'insurance'}>
          <VerifiedUser fontSize="inherit" />
          <CardLabelTypography type="icon">
            {status === RouteExecutionStatus.Idle
              ? t('main.tags.insurance')
              : t('main.tags.insured')}
          </CardLabelTypography>
        </CardLabel>
        <Switch onChange={handleSwitch} value={enabled} />
      </Box>
      <Collapse timeout={225} in={enabled} mountOnEnter unmountOnExit>
        <Box mt={2}>
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
            <InsuraceLogo />
          </Box>
          <Box>
            <Typography fontSize={14}>
              <Trans
                i18nKey={
                  status === RouteExecutionStatus.Idle
                    ? 'insurance.insure'
                    : 'insurance.insured'
                }
                values={{
                  amount: insuredAmount,
                  tokenSymbol: insuredTokenSymbol,
                }}
                components={[<strong />]}
              />
            </Typography>
            <Collapse
              timeout={225}
              in={enabled || status !== RouteExecutionStatus.Idle}
              mountOnEnter
              unmountOnExit
            >
              <Box
                sx={{
                  listStyleType: 'disc',
                  pl: 2,
                }}
              >
                <Typography fontSize={14} display="list-item">
                  {t('insurance.bridgeExploits')}
                </Typography>
                <Typography fontSize={14} display="list-item">
                  {t('insurance.slippageError')}
                </Typography>
              </Box>
            </Collapse>
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
              <Typography
                pt={0.5}
                color="primary"
                fontSize={14}
                fontWeight={600}
              >
                {status === RouteExecutionStatus.Idle
                  ? t('button.learnMore')
                  : t('button.viewCoverage')}
              </Typography>
            </Link>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
};
