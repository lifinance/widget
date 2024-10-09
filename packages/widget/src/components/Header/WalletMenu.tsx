import {
  getConnectorIcon,
  useAccount,
  useWalletMenu,
} from '@lifi/wallet-management'
import {
  ContentCopyRounded,
  OpenInNewRounded,
  PowerSettingsNewRounded,
} from '@mui/icons-material'
import { Avatar, Badge, Box, Button, IconButton, MenuItem } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAvailableChains } from '../../hooks/useAvailableChains.js'
import { useExplorer } from '../../hooks/useExplorer.js'
import { shortenAddress } from '../../utils/wallet.js'
import { AvatarMasked } from '../Avatar/Avatar.style.js'
import { SmallAvatar } from '../Avatar/SmallAvatar.js'
import { DisconnectIconButton } from './DisconnectIconButton.js'

export const WalletMenu = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation()
  const { accounts } = useAccount()
  const { getChainById } = useAvailableChains()
  const { openWalletMenu } = useWalletMenu()
  const connect = async () => {
    openWalletMenu()
    onClose()
  }
  const { getAddressLink } = useExplorer()

  return (
    <>
      <Box display="flex" flexDirection="column">
        {accounts.map((account) => {
          const chain = getChainById(account.chainId)
          const walletAddress = shortenAddress(account.address)
          const handleCopyAddress = async () => {
            await navigator.clipboard.writeText(account.address ?? '')
            onClose()
          }

          return (
            <MenuItem key={account.address} disableTouchRipple>
              <Box flex={1} display="flex" alignItems="center">
                {chain?.logoURI ? (
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <SmallAvatar src={chain?.logoURI} alt={chain?.name}>
                        {chain?.name[0]}
                      </SmallAvatar>
                    }
                    sx={{ marginRight: 1.5 }}
                  >
                    <AvatarMasked
                      src={getConnectorIcon(account.connector)}
                      alt={account.connector?.name}
                    >
                      {account.connector?.name[0]}
                    </AvatarMasked>
                  </Badge>
                ) : (
                  <Avatar
                    src={getConnectorIcon(account.connector)}
                    alt={account.connector?.name}
                    sx={{
                      marginRight: 1.5,
                    }}
                  >
                    {account.connector?.name[0]}
                  </Avatar>
                )}
                {walletAddress}
              </Box>
              <Box ml={2}>
                <IconButton size="medium" onClick={handleCopyAddress}>
                  <ContentCopyRounded />
                </IconButton>
                <IconButton
                  size="medium"
                  component="a"
                  onClick={onClose}
                  href={
                    account.address
                      ? getAddressLink(account.address, chain)
                      : undefined
                  }
                  target="_blank"
                >
                  <OpenInNewRounded />
                </IconButton>
                <DisconnectIconButton account={account} />
              </Box>
            </MenuItem>
          )
        })}
      </Box>
      <Button
        onClick={connect}
        fullWidth
        startIcon={<PowerSettingsNewRounded />}
        sx={{
          marginTop: 1,
        }}
      >
        {t('button.connectAnotherWallet')}
      </Button>
    </>
  )
}
