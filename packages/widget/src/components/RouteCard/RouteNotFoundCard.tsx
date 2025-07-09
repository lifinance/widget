import Route from '@mui/icons-material/Route'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const RouteNotFoundCard: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Box
      sx={{
        py: 1.625,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 1,
        whiteSpace: 'normal',
      }}
    >
      <Typography
        sx={{
          fontSize: 48,
        }}
      >
        <Route fontSize="inherit" />
      </Typography>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {t('info.title.routeNotFound')}
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          color: 'text.secondary',
          textAlign: 'center',
          mt: 2,
        }}
      >
        {t('info.message.routeNotFound')}
      </Typography>
    </Box>
  )
}
