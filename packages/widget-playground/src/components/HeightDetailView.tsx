import { defaultMaxHeight } from '@lifi/widget'
import type { JSX } from 'react'
import { useCallback, useMemo } from 'react'
import type { Layout } from '../store/editTools/types.js'
import { useHeaderAndFooterToolValues } from '../store/editTools/useHeaderAndFooterToolValues.js'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import {
  useConfigContainer,
  useConfigVariant,
} from '../store/widgetConfig/useConfigValues.js'
import { useDefaultConfig } from '../store/widgetConfig/useDefaultConfig.js'
import { docsLinks } from '../utils/docsLinks.js'
import {
  getDefaultLayoutCopy,
  getLayoutMode,
  isLayoutOptionDisabled,
  isRestrictedLayout,
  LAYOUT_OPTIONS,
} from '../utils/layout.js'
import { CardSelect } from './CardSelect/CardSelect.js'
import { DetailViewLayout } from './DetailView/DetailViewLayout.js'
import { HeightControl } from './HeightControl/HeightControl.js'

interface HeightDetailViewProps {
  onBack: () => void
}

export const HeightDetailView = ({
  onBack,
}: HeightDetailViewProps): JSX.Element => {
  const { container } = useConfigContainer()
  const { variant } = useConfigVariant()
  const { showMockHeader } = useHeaderAndFooterToolValues()
  const { setHeader, setContainer, getCurrentConfigTheme, setVariant } =
    useConfigActions()
  const { defaultConfig } = useDefaultConfig()

  const selectedLayoutId = getLayoutMode(container)
  const isDrawerVariant = variant === 'drawer'
  const defaultLayoutCopy = getDefaultLayoutCopy(isDrawerVariant)

  const handleLayoutSelect = useCallback(
    (layoutId: Layout): void => {
      const base = getCurrentConfigTheme()?.container ?? {}
      switch (layoutId) {
        case 'restricted-height':
          setHeader()
          setContainer({
            ...base,
            height: defaultMaxHeight,
            display: undefined,
            maxHeight: undefined,
          })
          break
        case 'restricted-max-height':
          setHeader()
          setContainer({
            ...base,
            maxHeight: defaultMaxHeight,
            display: undefined,
            height: undefined,
          })
          break
        case 'full-height':
          setVariant('compact')
          setHeader({ position: 'fixed', top: showMockHeader ? 48 : 0 })
          setContainer({
            ...base,
            display: 'flex',
            height: '100%',
            maxHeight: undefined,
          })
          break
        default:
          setHeader()
          setContainer({
            ...base,
            display: undefined,
            height: undefined,
            maxHeight: undefined,
          })
      }
    },
    [getCurrentConfigTheme, setContainer, setHeader, setVariant, showMockHeader]
  )

  const handleReset = useCallback((): void => {
    setHeader(defaultConfig?.theme?.header)
    setContainer(defaultConfig?.theme?.container)
  }, [defaultConfig, setHeader, setContainer])

  const heightControl = useMemo(
    () =>
      !isDrawerVariant ? (
        <HeightControl selectedLayoutId={selectedLayoutId} />
      ) : null,
    [isDrawerVariant, selectedLayoutId]
  )

  const getRestrictedHeightFooter = (layoutId: Layout): JSX.Element | null =>
    isRestrictedLayout(layoutId) && selectedLayoutId === layoutId
      ? heightControl
      : null

  return (
    <DetailViewLayout
      onBack={onBack}
      onReset={handleReset}
      resetLabel="Reset height"
      title="Height"
      description="Configure how the widget is embedded and how tall it can be."
      docsHref={docsLinks.height}
    >
      <CardSelect
        title={defaultLayoutCopy.title}
        description={defaultLayoutCopy.description}
        selected={selectedLayoutId === 'default'}
        onClick={() => handleLayoutSelect('default')}
      />
      {LAYOUT_OPTIONS.map(({ id, title, description }) => (
        <CardSelect
          key={id}
          title={title}
          description={description}
          selected={selectedLayoutId === id}
          disabled={isLayoutOptionDisabled(id, variant, isDrawerVariant)}
          onClick={() => handleLayoutSelect(id)}
          footer={getRestrictedHeightFooter(id)}
        />
      ))}
    </DetailViewLayout>
  )
}
