import EvStationIcon from '@mui/icons-material/EvStation';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { GasSufficiency } from '../../hooks';
import {
  WarningMessageCard,
  WarningMessageCardTitle,
} from './GasMessage.style';

interface GasSufficiencyMessageProps {
  insufficientGas?: GasSufficiency[];
}

export const GasSufficiencyMessage: React.FC<GasSufficiencyMessageProps> = ({
  insufficientGas,
}) => {
  const { t } = useTranslation();
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
    </WarningMessageCard>
  );
};
