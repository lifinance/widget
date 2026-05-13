import { StyledDocsLink } from './DocsLink.style.js'

export const DocsLink = ({ href }: { href: string }): React.ReactElement => (
  <StyledDocsLink href={href} target="_blank" rel="noopener noreferrer">
    Read docs
  </StyledDocsLink>
)
