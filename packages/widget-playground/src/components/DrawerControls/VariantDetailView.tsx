import type { WidgetVariant } from '@lifi/widget'
import type { JSX } from 'react'
import { useCallback } from 'react'
import { useConfigActions } from '../../store/widgetConfig/useConfigActions.js'
import { useConfigVariant } from '../../store/widgetConfig/useConfigValues.js'
import { CardSelect } from './CardSelect.js'
import { DetailViewHeader } from './DetailViewHeader.js'
import {
  CardsContainer,
  Content,
  Description,
  Title,
  TitleSection,
} from './VariantDetailView.style.js'

interface VariantDetailViewProps {
  onBack: () => void
  onReset: () => void
}

export const VariantDetailView = ({
  onBack,
  onReset,
}: VariantDetailViewProps): JSX.Element => {
  const { variant } = useConfigVariant()
  const { setVariant, setHeader, setContainer, getCurrentConfigTheme } =
    useConfigActions()

  const handleSelect = useCallback(
    (value: WidgetVariant): void => {
      setVariant(value)
      setHeader()

      const baseContainer = getCurrentConfigTheme()?.container || {}

      const containerConfig =
        value === 'drawer'
          ? {
              ...baseContainer,
              maxHeight: undefined,
              display: undefined,
              height: '100%',
            }
          : {
              ...baseContainer,
              display: undefined,
              height: undefined,
            }

      setContainer(containerConfig)
    },
    [getCurrentConfigTheme, setContainer, setHeader, setVariant]
  )

  return (
    <>
      <DetailViewHeader onBack={onBack} onReset={onReset} />
      <Content>
        <TitleSection>
          <Title>Variant</Title>
          <Description>
            Choose how secondary panels like the chain selector and route
            summary are displayed.
          </Description>
        </TitleSection>
        <CardsContainer>
          <CardSelect
            title="Compact"
            description="Information details appear stacked within a single column."
            selected={variant === 'compact'}
            onClick={() => handleSelect('compact')}
          />
          <CardSelect
            title="Wide"
            description="Information details can open in a dedicated side panel next to the main form."
            selected={variant === 'wide'}
            onClick={() => handleSelect('wide')}
          />
          <CardSelect
            title="Drawer"
            description="Widget opens as a slide-out drawer anchored to the side of the viewport."
            selected={variant === 'drawer'}
            onClick={() => handleSelect('drawer')}
          />
        </CardsContainer>
      </Content>
    </>
  )
}
