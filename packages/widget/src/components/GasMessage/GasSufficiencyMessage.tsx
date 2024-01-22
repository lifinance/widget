import EvStationIcon from '@mui/icons-material/EvStation';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatUnits } from 'viem';
import type { GasSufficiency } from '../../hooks';
import { AlertMessage } from '../AlertMessage';

interface GasSufficiencyMessageProps {
  insufficientGas?: GasSufficiency[];
}

export const GasSufficiencyMessage: React.FC<GasSufficiencyMessageProps> = ({
  insufficientGas,
}) => {
  const { t } = useTranslation();
  return (
    <AlertMessage
      severity="warning"
      icon={<EvStationIcon />}
      title={
        <Typography variant="body2" fontWeight={700}>
          {t(`warning.title.insufficientGas`)}
        </Typography>
      }
    >
      <Typography variant="body2" px={2} pt={1}>
        {t(`warning.message.insufficientGas`)}
      </Typography>
      {insufficientGas?.map((item, index) => (
        <Typography key={index} variant="body2" px={2} pt={0.5}>
          {t(`main.tokenOnChainAmount`, {
            amount: formatUnits(
              item.insufficientAmount ?? 0n,
              item.token.decimals,
            ),
            tokenSymbol: item.token.symbol,
            chainName: item.chain?.name,
          })}
        </Typography>
      ))}
    </AlertMessage>
  );
};
