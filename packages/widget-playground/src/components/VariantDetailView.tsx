import type { WidgetVariant } from '@lifi/widget'
import type { JSX } from 'react'
import { useCallback } from 'react'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import { useConfigVariant } from '../store/widgetConfig/useConfigValues.js'
import { useDefaultConfig } from '../store/widgetConfig/useDefaultConfig.js'
import { docsLinks } from '../utils/docsLinks.js'
import {
  getContainerConfigForVariant,
  VARIANT_OPTIONS,
} from '../utils/variant.js'
import { CardSelect } from './CardSelect/CardSelect.js'
import { DetailViewLayout } from './DetailView/DetailViewLayout.js'

interface VariantDetailViewProps {
  onBack: () => void
}

export const VariantDetailView = ({
  onBack,
}: VariantDetailViewProps): JSX.Element => {
  const { variant } = useConfigVariant()
  const { setVariant, setHeader, setContainer, getCurrentConfigTheme } =
    useConfigActions()
  const { defaultConfig } = useDefaultConfig()

  const handleReset = useCallback((): void => {
    setVariant(defaultConfig?.variant ?? 'compact')
    setHeader(defaultConfig?.theme?.header)
    setContainer(defaultConfig?.theme?.container)
  }, [defaultConfig, setVariant, setHeader, setContainer])

  const handleSelect = useCallback(
    (value: WidgetVariant): void => {
      setVariant(value)
      setHeader()
      setContainer(
        getContainerConfigForVariant(
          value,
          getCurrentConfigTheme()?.container ?? {}
        )
      )
    },
    [getCurrentConfigTheme, setContainer, setHeader, setVariant]
  )

  return (
    <DetailViewLayout
      onBack={onBack}
      onReset={handleReset}
      resetLabel="Reset variant"
      title="Variant"
      description="Choose how secondary panels like the chain selector and route summary are displayed."
      docsHref={docsLinks.variants}
    >
      {VARIANT_OPTIONS.map(({ id, title, description }) => (
        <CardSelect
          key={id}
          title={title}
          description={description}
          selected={variant === id}
          onClick={() => handleSelect(id)}
        />
      ))}
    </DetailViewLayout>
  )
}
