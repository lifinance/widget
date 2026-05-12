import type { JSX } from 'react'
import { FooterContainer, SecondaryButton } from './SidebarFooter.style.js'

export const SidebarFooter = (): JSX.Element => {
  const handleReadDocs = (): void => {
    window.open('https://docs.li.fi/widget/overview', '_blank')
  }

  return (
    <FooterContainer>
      <SecondaryButton
        variant="contained"
        disableElevation
        onClick={handleReadDocs}
      >
        Read our docs
      </SecondaryButton>
    </FooterContainer>
  )
}
