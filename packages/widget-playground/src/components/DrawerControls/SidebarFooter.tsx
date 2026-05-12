import type { JSX } from 'react'
import { docsLinks } from './docsLinks.js'
import { FooterContainer, FooterLink } from './SidebarFooter.style.js'

export const SidebarFooter = (): JSX.Element => {
  return (
    <FooterContainer>
      <FooterLink
        href={docsLinks.overview}
        target="_blank"
        rel="noopener noreferrer"
      >
        Read our docs
      </FooterLink>
    </FooterContainer>
  )
}
