import type { JSX } from 'react'
import { useCallback } from 'react'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import {
  useConfigSubvariant,
  useConfigSubvariantOptions,
} from '../../store/widgetConfig/useConfigValues.js'
import { CardSelect } from './CardSelect.js'
import { DetailViewHeader } from './DetailViewHeader.js'
import {
  CardsContainer,
  Content,
  Description,
  Title,
  TitleSection,
} from './ModeDetailView.style.js'

type ModeOption = 'exchange' | 'split' | 'swap' | 'bridge' | 'refuel'

function getActiveMode(
  subvariant: string,
  splitOption: string | undefined
): ModeOption {
  if (subvariant === 'refuel') {
    return 'refuel'
  }
  if (subvariant === 'split') {
    if (splitOption === 'swap') {
      return 'swap'
    }
    if (splitOption === 'bridge') {
      return 'bridge'
    }
    return 'split'
  }
  return 'exchange'
}

interface ModeDetailViewProps {
  onBack: () => void
  onReset: () => void
}

export const ModeDetailView = ({
  onBack,
  onReset,
}: ModeDetailViewProps): JSX.Element => {
  const { subvariant } = useConfigSubvariant()
  const { subvariantOptions } = useConfigSubvariantOptions()
  const { setSubvariant, setSplitOption } = useConfigActions()

  const activeMode = getActiveMode(
    subvariant,
    subvariantOptions?.split as string | undefined
  )

  const handleSelect = useCallback(
    (mode: ModeOption): void => {
      switch (mode) {
        case 'exchange':
          setSubvariant('default')
          setSplitOption(undefined)
          break
        case 'split':
          setSubvariant('split')
          setSplitOption(undefined)
          break
        case 'swap':
          setSubvariant('split')
          setSplitOption('swap')
          break
        case 'bridge':
          setSubvariant('split')
          setSplitOption('bridge')
          break
        case 'refuel':
          setSubvariant('refuel')
          setSplitOption(undefined)
          break
      }
    },
    [setSubvariant, setSplitOption]
  )

  return (
    <>
      <DetailViewHeader onBack={onBack} onReset={onReset} />
      <Content>
        <TitleSection>
          <Title>Mode</Title>
          <Description>
            Configure which flows are enabled. Pick a general-purpose or narrow
            it down.
          </Description>
        </TitleSection>
        <CardsContainer>
          <CardSelect
            title="Exchange"
            description="Switch between flows automatically based on the selected assets and best route."
            selected={activeMode === 'exchange'}
            onClick={() => handleSelect('exchange')}
          />
          <CardSelect
            title="Swap or Bridge"
            description="Separate Swap and Bridge options so users choose the flow explicitly."
            selected={activeMode === 'split'}
            onClick={() => handleSelect('split')}
          />
          <CardSelect
            title="Swap"
            description="Pure swap experience, no bridging shown in this widget."
            selected={activeMode === 'swap'}
            onClick={() => handleSelect('swap')}
          />
          <CardSelect
            title="Bridge"
            description="Move funds between chains only. No swap functionality in this widget."
            selected={activeMode === 'bridge'}
            onClick={() => handleSelect('bridge')}
          />
          <CardSelect
            title="Refuel"
            description="Dedicated gas-refuel flow that bridges a small amount of native token."
            selected={activeMode === 'refuel'}
            onClick={() => handleSelect('refuel')}
          />
        </CardsContainer>
      </Content>
    </>
  )
}
