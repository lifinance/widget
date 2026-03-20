import { Box, CircularProgress, styled, Typography } from '@mui/material'

const PageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  flex: 1,
  minHeight: 300,
}))

export const FundingProviderPage: React.FC = () => {
  return (
    <PageContainer>
      <CircularProgress size={48} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Loading Provider
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preparing your funding session...
        </Typography>
      </Box>
      <Typography variant="caption" color="text.secondary">
        Provider integrations (Transak, Mesh) are configured as optional peer
        dependencies. See the related issue for the dependency model.
      </Typography>
    </PageContainer>
  )
}
