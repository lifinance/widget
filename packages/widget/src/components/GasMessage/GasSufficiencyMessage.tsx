import EvStationIcon from '@mui/icons-material/EvStation';
import { Box, Typography } from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { GasSufficiency } from '../../hooks';
import { FormKey } from '../../providers';
import { formatTokenAmount } from '../../utils';
import { CardButton } from '../Card';
import {
  WarningMessageCard,
  WarningMessageCardTitle,
} from './GasMessage.style';

interface GasSufficiencyMessageProps {
  insufficientGas?: GasSufficiency[];
  allowReducibleAmount?: boolean;
}

export const GasSufficiencyMessage: React.FC<GasSufficiencyMessageProps> = ({
  insufficientGas,
  allowReducibleAmount,
}) => {
  const { t } = useTranslation();
  const { getValues, setValue } = useFormContext();
  const [fromToken] = useWatch({
    name: [FormKey.FromToken],
  });

  // We offer to reduce amount only when transferring native tokens
  const insufficientNativeToken = insufficientGas?.find(
    (item) =>
      item.token.address === fromToken &&
      item.chain?.nativeToken.address === fromToken,
  );
  const isReduceAmountAvailable =
    allowReducibleAmount && Boolean(insufficientNativeToken);

  const handleReduceAmount = () => {
    try {
      const fromAmount = parseFloat(getValues(FormKey.FromAmount));
      const insufficientAmount = parseFloat(
        insufficientNativeToken?.insufficientAmount?.toString() ?? '0',
      );
      const newFromAmount = fromAmount - insufficientAmount;
      if (newFromAmount > 0) {
        const adjustedFromAmount = newFromAmount * 0.95;
        setValue(
          FormKey.FromAmount,
          formatTokenAmount(adjustedFromAmount.toString()),
        );
      }
    } catch (error) {
      // ignore
    }
  };

  return (
    <WarningMessageCard>
      <WarningMessageCardTitle display="flex" alignItems="center" px={2} pt={2}>
        <EvStationIcon
          sx={{
            marginRight: 1,
          }}
        />
        <Typography variant="body2" fontWeight={700}>
          {t(`warning.title.insufficientGas`)}
        </Typography>
      </WarningMessageCardTitle>
      <Typography variant="body2" px={2} pt={1}>
        {t(`warning.message.insufficientGas`)}
      </Typography>
      {insufficientGas?.map((item, index) => (
        <Typography
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          variant="body2"
          px={2}
          pb={insufficientGas?.length - 1 === index ? 2 : 0}
          pt={0.5}
        >
          {t(`main.tokenOnChainAmount`, {
            amount: item.insufficientAmount?.toString(),
            tokenSymbol: item.token.symbol,
            chainName: item.chain?.name,
          })}
        </Typography>
      ))}
      {isReduceAmountAvailable ? (
        <Box px={2} pb={2}>
          <CardButton onClick={handleReduceAmount} fullWidth>
            Reduce amount
          </CardButton>
        </Box>
      ) : null}
    </WarningMessageCard>
  );
};
