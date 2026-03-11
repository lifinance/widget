import type { ExtendedChain, LiFiStep } from '@lifi/sdk'
import { Box, Grow } from '@mui/material'
import type { FC } from 'react'
import { SmallAvatar } from '../Avatar/SmallAvatar.js'
import { TextSecondary } from './Token.style.js'

interface TokenStepLabelProps {
  step?: LiFiStep
  stepVisible?: boolean
  chain?: ExtendedChain
}

export const TokenStepLabel: FC<TokenStepLabelProps> = ({
  step,
  stepVisible,
  chain,
}) => {
  const items = [
    { visible: !stepVisible, src: chain?.logoURI, name: chain?.name },
    {
      visible: stepVisible,
      src: step?.toolDetails.logoURI,
      name: step?.toolDetails.name,
    },
  ]

  return (
    <>
      <TextSecondary px={0.5} dot>
        &#x2022;
      </TextSecondary>
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          height: 16,
        }}
      >
        {items.map(({ visible, src, name }, index) => (
          <Grow
            key={`${name}-${index}`}
            in={visible}
            style={{ position: 'absolute' }}
            appear={false}
            timeout={225}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', height: 16 }}>
              <SmallAvatar src={src} alt={name} size={16} sx={{ mr: 0.75 }}>
                {name?.[0]}
              </SmallAvatar>
              <TextSecondary>{name}</TextSecondary>
            </Box>
          </Grow>
        ))}
      </Box>
    </>
  )
}
