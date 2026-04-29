import type { JSX } from 'react'
import { useConfig } from '../../store/widgetConfig/useConfig.js'
import { getConfigOutput } from '../../store/widgetConfig/utils/getConfigOutput.js'
import { stringifyConfig } from '../../utils/stringifyConfig.js'
import {
  FooterContainer,
  PrimaryButton,
  SecondaryButton,
} from './SidebarFooter.style.js'

export const SidebarFooter = (): JSX.Element => {
  const { config } = useConfig()

  const handleCopyCode = (): void => {
    if (config) {
      const code = stringifyConfig(getConfigOutput(config))
      if (code) {
        navigator.clipboard.writeText(code)
      }
    }
  }

  const handleReadDocs = (): void => {
    window.open('https://docs.li.fi/widget/overview', '_blank')
  }

  return (
    <FooterContainer>
      <PrimaryButton
        variant="contained"
        disableElevation
        onClick={handleCopyCode}
      >
        Copy code
      </PrimaryButton>
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
