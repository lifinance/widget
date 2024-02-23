import type { TokenAmount } from '@lifi/sdk';
import { ExpandLess, ExpandMore, VerifiedUser } from '@mui/icons-material';
import type { TooltipProps } from '@mui/material';
import { Box, Collapse, Tooltip, Typography } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js';
import { formatTokenAmount } from '../../utils/format.js';
import type { CardProps } from '../Card/Card.js';
import { Card } from '../Card/Card.js';
import { CardIconButton } from '../Card/CardIconButton.js';
import { CardLabel, CardLabelTypography } from '../Card/CardLabel.js';
import type { InsuredAmount } from '../Insurance/types.js';
import { StepActions } from '../StepActions/StepActions.js';
import { Token } from '../Token/Token.js';
import { TokenContainer } from './RouteCard.style.js';
import { RouteCardEssentials } from './RouteCardEssentials.js';
import { RouteCardEssentialsExpanded } from './RouteCardEssentialsExpanded.js';
import type { RouteCardProps } from './types.js';

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

  const tags = route.tags?.filter(
    (tag) => tag === 'CHEAPEST' || tag === 'FASTEST',
  );

  const cardContent = (
    <Box flex={1}>
      {subvariant !== 'refuel' && (insurable || route.tags?.length) ? (
        <Box display="flex" alignItems="center" mb={2}>
          {tags?.length ? (
            <CardLabel type={active ? 'active' : undefined}>
              <CardLabelTypography>
                {t(`main.tags.${tags[0].toLowerCase()}` as any)}
              </CardLabelTypography>
            </CardLabel>
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
                <VerifiedUser fontSize="inherit" />
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
            {cardExpanded ? <ExpandLess /> : <ExpandMore />}
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
