import { CircularProgress, Typography } from '@mui/material'
import { MessageBlock, Root } from './FundingProviderLoading.style.js'

export function FundingProviderLoading() {
  return (
    <Root>
      <CircularProgress size={48} />
      <MessageBlock>
        <Typography variant="h6" gutterBottom>
          Loading Provider
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preparing your funding session...
        </Typography>
      </MessageBlock>
      <Typography variant="caption" color="text.secondary">
        Provider integrations (Transak, Mesh) are configured as optional peer
        dependencies. See the related issue for the dependency model.
      </Typography>
    </Root>
  )
}
