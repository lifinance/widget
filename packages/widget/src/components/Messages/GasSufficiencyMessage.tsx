import { EvStation } from '@mui/icons-material'
import { type BoxProps, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { formatUnits } from 'viem'
import type { GasSufficiency } from '../../hooks/useGasSufficiency.js'
import { AlertMessage } from './AlertMessage.js'

interface GasSufficiencyMessageProps extends BoxProps {
  insufficientGas?: GasSufficiency[]
}

export const GasSufficiencyMessage: React.FC<GasSufficiencyMessageProps> = ({
  insufficientGas,
  ...props
}) => {
  const { t } = useTranslation()
  return (
    <AlertMessage
      severity="warning"
      icon={<EvStation />}
      title={
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
          }}
        >
          {t('warning.title.insufficientGas')}
        </Typography>
      }
      {...props}
    >
      <Typography
        variant="body2"
        sx={{
          px: 2,
          pt: 1,
        }}
      >
        {t('warning.message.insufficientGas')}
      </Typography>
      {insufficientGas?.map((item, index) => (
        <Typography
          key={index}
          variant="body2"
          sx={{
            px: 2,
            pt: 0.5,
          }}
        >
          {t('main.tokenOnChainAmount', {
            amount: formatUnits(
              item.insufficientAmount ?? 0n,
              item.token.decimals
            ),
            tokenSymbol: item.token.symbol,
            chainName: item.chain?.name,
          })}
        </Typography>
      ))}
    </AlertMessage>
  )
}
