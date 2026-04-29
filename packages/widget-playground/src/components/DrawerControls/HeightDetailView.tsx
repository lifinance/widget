import type { JSX } from 'react'
import { useCallback } from 'react'
import type { Layout } from '../../store/editTools/types.js'
import { CardSelect } from './CardSelect.js'
import { HeightControl } from './DesignControls/LayoutControls/HeightControl.js'
import { usePlaygroundLayoutControls } from './DesignControls/LayoutControls/usePlaygroundLayoutControls.js'
import { DetailViewHeader } from './DetailViewHeader.js'
import {
  CardsContainer,
  Content,
  Description,
  Title,
  TitleSection,
} from './HeightDetailView.style.js'

interface HeightDetailViewProps {
  onBack: () => void
  onReset: () => void
}

export const HeightDetailView = ({
  onBack,
  onReset,
}: HeightDetailViewProps): JSX.Element => {
  const {
    selectedLayoutId,
    setInitialLayout,
    heightValue,
    setHeightValue,
    variant,
  } = usePlaygroundLayoutControls()

  const isDrawerVariant = variant === 'drawer'

  const handleSelect = useCallback(
    (layoutId: Layout): void => {
      setHeightValue(undefined)
      setInitialLayout(layoutId)
    },
    [setHeightValue, setInitialLayout]
  )

  const heightFooter =
    !isDrawerVariant && selectedLayoutId === 'restricted-height' ? (
      <HeightControl
        selectedLayoutId={selectedLayoutId}
        setInitialLayout={setInitialLayout}
        heightValue={heightValue}
        setHeightValue={setHeightValue}
        onClearMaxHeight={() => handleSelect('default')}
      />
    ) : null

  const maxHeightFooter =
    !isDrawerVariant && selectedLayoutId === 'restricted-max-height' ? (
      <HeightControl
        selectedLayoutId={selectedLayoutId}
        setInitialLayout={setInitialLayout}
        heightValue={heightValue}
        setHeightValue={setHeightValue}
        onClearMaxHeight={() => handleSelect('default')}
      />
    ) : null

  return (
    <>
      <DetailViewHeader onBack={onBack} onReset={onReset} />
      <Content>
        <TitleSection>
          <Title>Height</Title>
          <Description>
            Configure how the widget is embedded and how tall it can be.
          </Description>
        </TitleSection>
        <CardsContainer>
          <CardSelect
            title="Default (fit content)"
            description="The widget height grows automatically with its content."
            selected={selectedLayoutId === 'default'}
            disabled={isDrawerVariant}
            onClick={() => handleSelect('default')}
          />
          <CardSelect
            title="Restricted height"
            description="Set a fixed height for the widget container."
            selected={selectedLayoutId === 'restricted-height'}
            disabled={isDrawerVariant}
            onClick={() => handleSelect('restricted-height')}
            footer={heightFooter}
          />
          <CardSelect
            title="Restricted max height"
            description="The widget grows with its content up to a maximum height."
            selected={selectedLayoutId === 'restricted-max-height'}
            disabled={isDrawerVariant}
            onClick={() => handleSelect('restricted-max-height')}
            footer={maxHeightFooter}
          />
          <CardSelect
            title="Full height"
            description="The widget uses the full viewport height. Best with the compact variant."
            selected={selectedLayoutId === 'full-height'}
            disabled={isDrawerVariant}
            onClick={() => handleSelect('full-height')}
          />
        </CardsContainer>
      </Content>
    </>
  )
}
