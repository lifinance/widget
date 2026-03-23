import Close from '@mui/icons-material/Close'
// import Wallet from '@mui/icons-material/Wallet'
// import EmergencyIcon from '@mui/icons-material/Emergency';
import { Box, IconButton, Typography } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useChain } from '../../hooks/useChain.js'
// import { useToAddressRequirements } from '../../hooks/useToAddressRequirements.js'
import { useWidgetConfig } from '../../providers/WidgetProvider/WidgetProvider.js'
import { useBookmarkActions } from '../../stores/bookmarks/useBookmarkActions.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { shortenAddress } from '../../utils/wallet.js'
import { ChainBadgeContent } from '../Avatar/ChainBadgeContent.js'
import { ButtonChip } from '../ButtonChip/ButtonChip.js'

interface SendToWalletButtonProps {
  chainId: number
  readOnly?: boolean
}

// TODO: agree on "required" styling and bookmarks
export const SendToWalletButton: React.FC<SendToWalletButtonProps> = ({
  chainId,
  readOnly,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { subvariant, subvariantOptions, toAddresses } = useWidgetConfig()
  const { setFieldValue } = useFieldActions()
  const [toAddressValue] = useFieldValues('toAddress')
  const { chain } = useChain(chainId)

  const { setSelectedBookmark } = useBookmarkActions()
  // const { requiredToAddress } = useToAddressRequirements()

  const label =
    subvariant === 'custom' && subvariantOptions?.custom === 'deposit'
      ? t('header.depositTo')
      : t('header.sendToWallet')

  const handleClick = readOnly
    ? undefined
    : () =>
        navigate({
          to: toAddresses?.length
            ? navigationRoutes.configuredWallets
            : navigationRoutes.sendToWallet,
        })

  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation()
    setFieldValue('toAddress', '', { isTouched: true })
    setSelectedBookmark()
  }

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <ButtonChip
        onClick={handleClick}
        sx={(theme) => ({
          display: 'flex',
          alignItems: 'center',
          borderRadius: theme.shape.borderRadius,
          mt: 1.5,
          height: 24,
          pl: 0.5,
          pr: 1,
        })}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ChainBadgeContent chain={chain} size={16} />
          <Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.334 }}>
            {toAddressValue ? shortenAddress(toAddressValue) : label}
          </Typography>
        </Box>
        {toAddressValue && !readOnly ? (
          <IconButton
            onClick={handleRemove}
            size="small"
            sx={{ mr: -0.25, p: 0.5 }}
          >
            <Close sx={{ fontSize: 12 }} />
          </IconButton>
        ) : null}
        {/* ) : <EmergencyIcon sx={{ fontSize: 10, color: '#E5452F', mt: -1, mx: 0.25 }} />}  */}
      </ButtonChip>
      {/* {requiredToAddress && !toAddressValue && (
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: 12,
          right: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: theme.vars.palette.error.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        })}
      />
    )} */}
    </Box>
  )
}
