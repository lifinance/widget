import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Box, Collapse } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWidgetConfig } from '../../providers';
import type { CardProps } from '../Card';
import { Card, CardIconButton, CardLabel, CardLabelTypography } from '../Card';
import { StepActions } from '../StepActions';
import { Token } from '../Token';
import { SwapRouteCardEssentials } from './SwapRouteCardEssentials';
import type { SwapRouteCardProps } from './types';

export const SwapRouteCard: React.FC<
  SwapRouteCardProps & Omit<CardProps, 'variant'>
> = ({ route, active, variant = 'default', expanded, ...other }) => {
  const { t } = useTranslation();
  const { variant: widgetVariant } = useWidgetConfig();
  const [cardExpanded, setCardExpanded] = useState(expanded);
  const insurable = route.insurance?.state === 'INSURABLE';
  const label: string | undefined = route.tags?.length
    ? t(`swap.tags.${route.tags[0].toLowerCase()}` as any)
    : insurable
    ? t(`swap.tags.insurable`)
    : undefined;

  const handleExpand: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setCardExpanded((expanded) => !expanded);
  };

  const token =
    widgetVariant === 'nft'
      ? { ...route.fromToken, amount: route.fromAmount }
      : { ...route.toToken, amount: route.toAmount };

  const cardContent = (
    <Box flex={1}>
      {widgetVariant !== 'refuel' && (insurable || route.tags?.length) ? (
        <Box display="flex" alignItems="center" mb={2}>
          {insurable ? (
            <CardLabel
              type={route.tags?.length ? 'insurance-icon' : 'insurance'}
            >
              <VerifiedUserIcon fontSize="inherit" />
              {!route.tags?.length ? (
                <CardLabelTypography type="icon">{label}</CardLabelTypography>
              ) : null}
            </CardLabel>
          ) : null}
          {route.tags?.length ? (
            <CardLabel type={active ? 'active' : undefined}>
              <CardLabelTypography>{label}</CardLabelTypography>
            </CardLabel>
          ) : null}
        </Box>
      ) : null}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Token
          token={token}
          step={!cardExpanded ? route.steps[0] : undefined}
        />
        {!expanded ? (
          <CardIconButton onClick={handleExpand} size="small">
            {cardExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </CardIconButton>
        ) : null}
      </Box>
      <Collapse timeout={225} in={cardExpanded} mountOnEnter unmountOnExit>
        {route.steps.map((step) => (
          <StepActions key={step.id} step={step} mt={2} />
        ))}
      </Collapse>
      <SwapRouteCardEssentials route={route} />
    </Box>
  );

  return widgetVariant === 'refuel' || variant === 'cardless' ? (
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
