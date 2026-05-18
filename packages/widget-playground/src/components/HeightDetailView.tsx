import type { JSX } from 'react'
import { useCallback } from 'react'
import { usePlaygroundLayoutControls } from '../hooks/usePlaygroundLayoutControls.js'
import type { Layout } from '../store/editTools/types.js'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import { useDefaultConfig } from '../store/widgetConfig/useDefaultConfig.js'
import { docsLinks } from '../utils/docsLinks.js'
import { CardSelect } from './CardSelect/CardSelect.js'
import {
  CardsContainer,
  Content,
  Description,
  Title,
  TitleSection,
} from './DetailView/DetailView.style.js'
import { DetailViewHeader } from './DetailView/DetailViewHeader.js'
import { DocsLink } from './DocsLink/DocsLink.js'
import { HeightControl } from './HeightControl/HeightControl.js'

interface HeightDetailViewProps {
  onBack: () => void
}

export const HeightDetailView = ({
  onBack,
}: HeightDetailViewProps): JSX.Element => {
  const {
    selectedLayoutId,
    setInitialLayout,
    heightValue,
    setHeightValue,
    variant,
  } = usePlaygroundLayoutControls()
  const { setHeader, setContainer } = useConfigActions()
  const { defaultConfig } = useDefaultConfig()

  const isDrawerVariant = variant === 'drawer'
  const isFullHeightDisabled = isDrawerVariant || variant === 'wide'

  const handleReset = useCallback((): void => {
    setHeader(defaultConfig?.theme?.header)
    setContainer(defaultConfig?.theme?.container)
  }, [defaultConfig, setHeader, setContainer])

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
        onClearMaxHeight={() => {
          setHeightValue(undefined)
          setInitialLayout(selectedLayoutId)
        }}
      />
    ) : null

  const maxHeightFooter =
    !isDrawerVariant && selectedLayoutId === 'restricted-max-height' ? (
      <HeightControl
        selectedLayoutId={selectedLayoutId}
        setInitialLayout={setInitialLayout}
        heightValue={heightValue}
        setHeightValue={setHeightValue}
        onClearMaxHeight={() => {
          setHeightValue(undefined)
          setInitialLayout(selectedLayoutId)
        }}
      />
    ) : null

  return (
    <>
      <DetailViewHeader onBack={onBack} onReset={handleReset} />
      <Content>
        <TitleSection>
          <Title>Height</Title>
          <Description>
            Configure how the widget is embedded and how tall it can be.
          </Description>
          <DocsLink href={docsLinks.layout} />
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
            disabled={isFullHeightDisabled}
            onClick={() => handleSelect('full-height')}
          />
        </CardsContainer>
      </Content>
    </>
  )
}
