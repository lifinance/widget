import { Step } from '@lifinance/sdk';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { Avatar, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useChains } from '../../hooks';
import LiFiLogo from '../../icons/LiFiLogo.svg';
import { formatTokenAmount } from '../../utils/format';

export const ToolItem: React.FC<{
  step: any;
}> = ({ step }) => {
  return (
    <Box px={2} py={1}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant={step.type === 'lifi' ? 'square' : 'circular'}
          src={step.type === 'lifi' ? LiFiLogo : step.toolDetails.logoURI}
          alt={step.toolDetails.name}
        >
          {step.toolDetails.name[0]}
        </Avatar>
        <Typography
          ml={2}
          fontSize={18}
          fontWeight="500"
          textTransform="capitalize"
        >
          {step.type === 'lifi'
            ? 'LI.FI Smart Contract'
            : step.toolDetails.name}
        </Typography>
      </Box>
      <Box ml={6}>
        {step.type === 'cross' || step.type === 'lifi' ? (
          <CrossChainDetails step={step} />
        ) : null}
        <Typography
          fontSize={12}
          fontWeight="500"
          color="text.secondary"
          alignItems="center"
          display="flex"
        >
          {formatTokenAmount(
            step.estimate.fromAmount,
            step.action.fromToken.decimals,
          )}{' '}
          {step.action.fromToken.symbol}
          <ArrowForwardIcon sx={{ fontSize: '.75rem', paddingX: 0.5 }} />
          {formatTokenAmount(
            step.estimate.toAmount,
            step.action.toToken.decimals,
          )}{' '}
          {step.action.toToken.symbol}
        </Typography>
      </Box>
    </Box>
  );
};

export const CrossChainDetails: React.FC<{
  step: Step;
}> = ({ step }) => {
  const { t } = useTranslation();
  const { getChainById } = useChains();

  return (
    <Typography fontSize={12} fontWeight="500" color="text.secondary">
      {t('swapping.crossChainDetails', {
        from: getChainById(step.action.fromChainId)?.name,
        to: getChainById(step.action.toChainId)?.name,
        via: step.tool,
      })}
    </Typography>
  );
};
