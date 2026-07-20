import { Avatar, Box, Typography } from '@mui/material'
import type { JSX, ReactNode } from 'react'
import {
  FundingOptionRow,
  FundingOptionSubtitle,
  FundingOptionTitle,
  GenericIconWrap,
  OptionTextCell,
} from './SelectSourceFundingOptions.style.js'

export type ConnectedAccountRowProps = {
  /** Logo/icon URL; falls back to `fallbackIcon` when absent. */
  iconSrc?: string
  fallbackIcon: ReactNode
  title: string
  subtitle: string
  connectedLabel: string
  /** Optional trailing control (e.g. a disconnect button). */
  trailing?: ReactNode
}

/**
 * Shared "connected account" card body: avatar + title/subtitle + a
 * "Connected" badge. Used for both the linked wallet and a previously-linked
 * exchange account.
 */
export function ConnectedAccountRow({
  iconSrc,
  fallbackIcon,
  title,
  subtitle,
  connectedLabel,
  trailing,
}: ConnectedAccountRowProps): JSX.Element {
  return (
    <FundingOptionRow sx={{ alignItems: 'center' }}>
      {iconSrc ? (
        <Avatar
          src={iconSrc}
          alt=""
          sx={{ width: 40, height: 40, flexShrink: 0 }}
        />
      ) : (
        <GenericIconWrap>{fallbackIcon}</GenericIconWrap>
      )}
      <OptionTextCell>
        <FundingOptionTitle>{title}</FundingOptionTitle>
        <FundingOptionSubtitle noWrap>{subtitle}</FundingOptionSubtitle>
      </OptionTextCell>
      <Box
        sx={{
          display: 'flex',
          flexShrink: 0,
          alignItems: 'center',
          gap: 0.75,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 400, lineHeight: '20px', whiteSpace: 'nowrap' }}
        >
          {connectedLabel}
        </Typography>
        {trailing}
      </Box>
    </FundingOptionRow>
  )
}
