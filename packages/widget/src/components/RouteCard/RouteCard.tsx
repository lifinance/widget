import type { TokenAmount } from '@lifi/sdk';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import type { TooltipProps } from '@mui/material';
import { Box, Collapse, Tooltip, Typography } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { Fragment, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../../providers';
import { formatTokenAmount } from '../../utils';
import type { CardProps } from '../Card';
import { Card, CardIconButton, CardLabel, CardLabelTypography } from '../Card';
import type { InsuredAmount } from '../Insurance';
import { StepActions } from '../StepActions';
import { Token } from '../Token';
import { TokenContainer } from './RouteCard.style';
import { RouteCardEssentials } from './RouteCardEssentials';
import { RouteCardEssentialsExpanded } from './RouteCardEssentialsExpanded';
import type { RouteCardProps } from './types';

export const RouteCard: React.FC<
  RouteCardProps & Omit<CardProps, 'variant'>
> = ({
  route,
  active,
  variant = 'default',
  expanded: defaulExpanded,
  ...other
}) => {
  const { t } = useTranslation();
  const { subvariant } = useWidgetConfig();
  const [cardExpanded, setCardExpanded] = useState(defaulExpanded);

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setCardExpanded((expanded) => !expanded);
  };

  const insurable = route.insurance?.state === 'INSURABLE';

  const token: TokenAmount =
    subvariant === 'nft'
      ? { ...route.fromToken, amount: BigInt(route.fromAmount) }
      : { ...route.toToken, amount: BigInt(route.toAmount) };

  const RecommendedTagTooltip =
    route.tags?.[0] === 'RECOMMENDED' ? RecommendedTooltip : Fragment;

  const cardContent = (
    <Box flex={1}>
      {subvariant !== 'refuel' && (insurable || route.tags?.length) ? (
        <Box display="flex" alignItems="center" mb={2}>
          {route.tags?.length ? (
            <RecommendedTagTooltip>
              <CardLabel type={active ? 'active' : undefined}>
                <CardLabelTypography>
                  {t(`main.tags.${route.tags[0].toLowerCase()}` as any)}
                </CardLabelTypography>
              </CardLabel>
            </RecommendedTagTooltip>
          ) : null}
          {insurable ? (
            <InsuranceTooltip
              insuredAmount={formatTokenAmount(
                BigInt(route.toAmountMin),
                route.toToken.decimals,
              )}
              insuredTokenSymbol={route.toToken.symbol}
            >
              <CardLabel type={'insurance'}>
                <VerifiedUserIcon fontSize="inherit" />
                <CardLabelTypography type="icon">
                  {t(`main.tags.insurable`)}
                </CardLabelTypography>
              </CardLabel>
            </InsuranceTooltip>
          ) : null}
        </Box>
      ) : null}
      <TokenContainer>
        <Token
          token={token}
          step={route.steps[0]}
          stepVisible={!cardExpanded}
        />
        {!defaulExpanded ? (
          <CardIconButton onClick={handleExpand} size="small">
            {cardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </CardIconButton>
        ) : null}
      </TokenContainer>
      <Collapse timeout={225} in={cardExpanded} mountOnEnter unmountOnExit>
        {route.steps.map((step) => (
          <StepActions key={step.id} step={step} mt={2} />
        ))}
        <RouteCardEssentialsExpanded route={route} />
      </Collapse>
      <Collapse timeout={225} in={!cardExpanded} mountOnEnter unmountOnExit>
        <RouteCardEssentials route={route} />
      </Collapse>
    </Box>
  );

  return subvariant === 'refuel' || variant === 'cardless' ? (
    cardContent
  ) : (
    <Card
      variant={active ? 'selected' : 'default'}
      selectionColor="secondary"
      indented
      {...other}
    >
      {cardContent}
    </Card>
  );
};

const InsuranceTooltip: React.FC<
  InsuredAmount & Pick<TooltipProps, 'children'>
> = ({ insuredAmount, insuredTokenSymbol, children }) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      title={
        <Box component="span">
          <Typography fontSize={12} fontWeight="500">
            <Trans
              i18nKey="insurance.insure"
              values={{
                amount: insuredAmount,
                tokenSymbol: insuredTokenSymbol,
              }}
              components={[<strong />]}
            />
          </Typography>
          <Box
            sx={{
              listStyleType: 'disc',
              pl: 2,
            }}
          >
            <Typography fontSize={12} fontWeight="500" display="list-item">
              {t('insurance.bridgeExploits')}
            </Typography>
            <Typography fontSize={12} fontWeight="500" display="list-item">
              {t('insurance.slippageError')}
            </Typography>
          </Box>
        </Box>
      }
      placement="top"
      enterDelay={400}
      arrow
    >
      {children}
    </Tooltip>
  );
};

const RecommendedTooltip: React.FC<Pick<TooltipProps, 'children'>> = ({
  children,
}) => {
  const { t } = useTranslation();
  return (
    <Tooltip
      title={t('tooltip.recommended')}
      placement="top"
      enterDelay={400}
      arrow
    >
      {children}
    </Tooltip>
  );
};
