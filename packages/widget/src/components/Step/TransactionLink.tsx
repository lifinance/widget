import Done from '@mui/icons-material/Done'
import OpenInNew from '@mui/icons-material/OpenInNew'
import type React from 'react'
import {
  ExternalLinkIcon,
  SuccessIconCircle,
  TransactionLinkContainer,
  TransactionLinkLabel,
} from './TransactionLink.style.js'

export interface TransactionLinkProps {
  label: string
  href: string
}

export const TransactionLink: React.FC<TransactionLinkProps> = ({
  label,
  href,
}) => {
  return (
    <TransactionLinkContainer>
      <SuccessIconCircle>
        <Done
          color="success"
          sx={{
            fontSize: 16,
          }}
        />
      </SuccessIconCircle>
      <TransactionLinkLabel>{label}</TransactionLinkLabel>
      <ExternalLinkIcon href={href} target="_blank" rel="nofollow noreferrer">
        <OpenInNew
          sx={{
            fontSize: 16,
          }}
        />
      </ExternalLinkIcon>
    </TransactionLinkContainer>
  )
}
