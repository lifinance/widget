import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const ProgressPage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Box sx={{ p: 2, flex: 1 }}>
      <Typography variant="h6" gutterBottom>
        {t('checkout.progress.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t('checkout.progress.description')}
      </Typography>
    </Box>
  )
}
