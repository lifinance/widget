import ReportRoundedIcon from '@mui/icons-material/ReportRounded'
import VerifiedIcon from '@mui/icons-material/Verified'
import type { SvgIcon } from '@mui/material'
import type { TokenVerificationBadge } from '../../utils/token.js'

export const tokenVerificationIcons: Record<
  TokenVerificationBadge,
  { Icon: typeof SvgIcon; color: string }
> = {
  native: { Icon: VerifiedIcon, color: 'info.main' },
  flagged: { Icon: ReportRoundedIcon, color: 'error.main' },
  verified: { Icon: VerifiedIcon, color: 'success.main' },
  unverifiedByProvider: { Icon: ReportRoundedIcon, color: 'warning.main' },
  unverified: { Icon: ReportRoundedIcon, color: 'warning.main' },
}
