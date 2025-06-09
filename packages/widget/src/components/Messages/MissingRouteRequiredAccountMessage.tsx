import type { ExtendedChain } from '@lifi/sdk'
import Wallet from '@mui/icons-material/Wallet'
import type { BoxProps } from '@mui/material'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { shortenAddress } from '../../utils/wallet.js'
import { AlertMessage } from './AlertMessage.js'

interface MissingRouteRequiredAccountMessageProps extends BoxProps {
  chain?: ExtendedChain
  address?: string
}

export const MissingRouteRequiredAccountMessage: React.FC<
  MissingRouteRequiredAccountMessageProps
> = ({ chain, address, ...props }) => {
  const { t } = useTranslation()

  if (!chain) {
    return null
  }

  return (
    <AlertMessage
      title={
        <Typography
          variant="body2"
          sx={{
            px: 1,
            color: 'text.primary',
          }}
        >
          {t('info.message.missingRouteRequiredAccount', {
            chainName: chain.name,
            address: address ? `(${shortenAddress(address)})` : '',
          })}
        </Typography>
      }
      icon={<Wallet />}
      multiline
      {...props}
    />
  )
}
