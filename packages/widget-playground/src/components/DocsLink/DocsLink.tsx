import type { JSX } from 'react'
import { StyledDocsLink } from './DocsLink.style.js'

export const DocsLink = ({ href }: { href: string }): JSX.Element => (
  <StyledDocsLink href={href} target="_blank" rel="noopener noreferrer">
    Read docs
  </StyledDocsLink>
)
