import type { WidgetVariant } from '@lifi/widget'
import type { JSX } from 'react'
import { useCallback } from 'react'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import {
  useConfigHiddenUI,
  useConfigVariant,
} from '../store/widgetConfig/useConfigValues.js'
import { useDefaultConfig } from '../store/widgetConfig/useDefaultConfig.js'
import { docsLinks } from '../utils/docsLinks.js'
import {
  getContainerConfigForVariant,
  VARIANT_OPTIONS,
} from '../utils/variant.js'
import { CardSelect } from './CardSelect/CardSelect.js'
import { DetailViewLayout } from './DetailView/DetailViewLayout.js'
import { ToggleRow, ToggleRowLabel } from './Row.style.js'
import { Switch } from './Switch.style.js'

interface VariantDetailViewProps {
  onBack: () => void
}

export const VariantDetailView = ({
  onBack,
}: VariantDetailViewProps): JSX.Element => {
  const { variant } = useConfigVariant()
  const { hiddenUI } = useConfigHiddenUI()
  const {
    setVariant,
    setHeader,
    setContainer,
    getCurrentConfigTheme,
    setChainSidebarDisabled,
  } = useConfigActions()
  const { defaultConfig } = useDefaultConfig()

  const handleReset = useCallback((): void => {
    setVariant(defaultConfig?.variant ?? 'compact')
    setHeader(defaultConfig?.theme?.header)
    setContainer(defaultConfig?.theme?.container)
    setChainSidebarDisabled(false)
  }, [
    defaultConfig,
    setVariant,
    setHeader,
    setContainer,
    setChainSidebarDisabled,
  ])

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

  const handleDisableChainSidebar = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
      setChainSidebarDisabled(checked)
    },
    [setChainSidebarDisabled]
  )

  const wideFooter = (
    <ToggleRow sx={{ mt: 0 }}>
      <ToggleRowLabel sx={{ fontSize: 14, lineHeight: '18px' }}>
        Disable chain sidebar
      </ToggleRowLabel>
      <Switch
        checked={!!hiddenUI?.chainSidebar}
        onChange={handleDisableChainSidebar}
        aria-label="Disable chain sidebar"
      />
    </ToggleRow>
  )

  return (
    <DetailViewLayout
      onBack={onBack}
      onReset={handleReset}
      resetLabel="Reset variant"
      title="Variant"
      description="Choose how secondary panels like the chain selector and route summary are displayed."
      docsHref={docsLinks.variant}
    >
      {VARIANT_OPTIONS.map(({ id, title, description }) => (
        <CardSelect
          key={id}
          title={title}
          description={description}
          selected={variant === id}
          onClick={() => handleSelect(id)}
          footer={id === 'wide' && variant === 'wide' ? wideFooter : undefined}
        />
      ))}
    </DetailViewLayout>
  )
}
