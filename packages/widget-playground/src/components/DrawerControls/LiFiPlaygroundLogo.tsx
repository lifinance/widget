import type { JSX } from 'react'
import {
  BrandSuffix,
  HorizontalLogo,
  LogoContainer,
} from './LiFiPlaygroundLogo.style.js'

export const LiFiPlaygroundLogo = (): JSX.Element => {
  return (
    <LogoContainer>
      <HorizontalLogo
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 132 48"
        fill="none"
        role="img"
        aria-label="LI.FI"
      >
        <title>LI.FI</title>
        <path
          fill="currentColor"
          d="m19.314 0 9.878 9.879a3 3 0 0 1 0 4.242L23.314 20l-4-4c-4.419-4.418-4.419-11.582 0-16Z"
        />
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="m19.314 48-16-16c-4.419-4.418-4.419-11.582 0-16l13.878 13.879a3 3 0 0 0 4.243 0L35.314 16c4.418 4.418 4.418 11.582 0 16l-16 16Z"
          clipRule="evenodd"
        />
        <path
          fill="currentColor"
          d="M123.319 36s.034-21 0-22 .985-2 1.966-2h4.034v22c.035 1-.965 2-1.965 2h-4.035ZM99.32 14v22h6v-8h10c1 0 2-1 2-2v-4h-12v-4h12c1 0 2-1 2-2v-4h-18c-1 0-2 1-2 2Zm-9.998 18c0-1 1-2 2-2h2c1 0 2 1 2 2v2c0 1-1 2-2 2h-2c-1 0-2-1-2-2v-2Zm-10.001 4s.034-21 0-22 .985-2 1.966-2h4.034v22c.035 1-.965 2-1.965 2h-4.035ZM55.32 30V14c0-1 .87-2 2-2h4v18h14v4c0 1-1 2-2 2h-18v-6Z"
        />
      </HorizontalLogo>
      <BrandSuffix>PLAYGROUND</BrandSuffix>
    </LogoContainer>
  )
}
