import { Wallet } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const WalletMenuContentEmpty: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingY: 8,
      }}
    >
      <Typography fontSize={48}>
        <Wallet fontSize="inherit" />
      </Typography>
      <Typography fontSize={18} fontWeight={700}>
        {t('title.availableWalletsNotFound')}
      </Typography>
      <Typography
        fontSize={14}
        color="text.secondary"
        textAlign="center"
        mt={2}
      >
        {t('message.availableWalletsNotFound')}
      </Typography>
    </Box>
  )
}
