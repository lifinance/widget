import type { JSX } from 'react'
import { useCallback, useMemo } from 'react'
import { usePlaygroundLayoutControls } from '../hooks/usePlaygroundLayoutControls.js'
import type { Layout } from '../store/editTools/types.js'
import { useEditToolsActions } from '../store/editTools/useEditToolsActions.js'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
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
  const {
    selectedLayoutId,
    setInitialLayout,
    heightValue,
    setHeightValue,
    variant,
  } = usePlaygroundLayoutControls()
  const { setHeader, setContainer } = useConfigActions()
  const { setSelectedLayoutId } = useEditToolsActions()
  const { defaultConfig } = useDefaultConfig()

  const isDrawerVariant = variant === 'drawer'
  const defaultLayoutCopy = getDefaultLayoutCopy(isDrawerVariant)

  const handleReset = useCallback((): void => {
    setHeader(defaultConfig?.theme?.header)
    setContainer(defaultConfig?.theme?.container)
    setHeightValue(undefined)
    setSelectedLayoutId(getLayoutMode(defaultConfig?.theme?.container))
  }, [
    defaultConfig,
    setHeader,
    setContainer,
    setHeightValue,
    setSelectedLayoutId,
  ])

  const handleSelect = useCallback(
    (layoutId: Layout): void => {
      setHeightValue(undefined)
      setInitialLayout(layoutId)
    },
    [setHeightValue, setInitialLayout]
  )

  const heightControl = useMemo(
    () =>
      !isDrawerVariant ? (
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
      ) : null,
    [
      isDrawerVariant,
      selectedLayoutId,
      setInitialLayout,
      heightValue,
      setHeightValue,
    ]
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
        onClick={() => handleSelect('default')}
      />
      {LAYOUT_OPTIONS.map(({ id, title, description }) => (
        <CardSelect
          key={id}
          title={title}
          description={description}
          selected={selectedLayoutId === id}
          disabled={isLayoutOptionDisabled(id, variant, isDrawerVariant)}
          onClick={() => handleSelect(id)}
          footer={getRestrictedHeightFooter(id)}
        />
      ))}
    </DetailViewLayout>
  )
}
