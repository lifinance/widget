import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Box, Collapse, Link, Typography } from '@mui/material';
import type { ChangeEvent, MouseEventHandler } from 'react';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { InsuraceLogo } from '../../icons';
import { RouteExecutionStatus } from '../../stores';
import { Card, CardIconButton, CardLabel, CardLabelTypography } from '../Card';
import { Switch } from '../Switch';
import type { InsuranceCardProps } from './types';

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
  const [cardExpanded, setCardExpanded] = useState(
    status === RouteExecutionStatus.Idle,
  );

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setCardExpanded((expanded) => !expanded);
  };

  const handleSwitch = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setEnabled(checked);
    onChange?.(checked);
  };

  return (
    <Card selectionColor="secondary" indented {...props}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <CardLabel type={'insurance'}>
          <VerifiedUserIcon fontSize="inherit" />
          <CardLabelTypography type="icon">
            {status === RouteExecutionStatus.Idle
              ? t('main.tags.insurance')
              : t('main.tags.insured')}
          </CardLabelTypography>
        </CardLabel>
        {status === RouteExecutionStatus.Idle ? (
          <Switch onChange={handleSwitch} value={enabled} />
        ) : (
          <Box my={-0.5}>
            <CardIconButton onClick={handleExpand} size="small">
              {cardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </CardIconButton>
          </Box>
        )}
      </Box>
      <Collapse timeout={225} in={cardExpanded} mountOnEnter unmountOnExit>
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
