import type { JSX } from 'react'
import { useCallback, useMemo } from 'react'
import { usePlaygroundLayoutControls } from '../hooks/usePlaygroundLayoutControls.js'
import type { Layout } from '../store/editTools/types.js'
import { useConfigActions } from '../store/widgetConfig/useConfigActions.js'
import { useDefaultConfig } from '../store/widgetConfig/useDefaultConfig.js'
import { docsLinks } from '../utils/docsLinks.js'
import {
  getDefaultLayoutCopy,
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
  const { selectedLayoutId, setInitialLayout, variant } =
    usePlaygroundLayoutControls()
  const { setHeader, setContainer } = useConfigActions()
  const { defaultConfig } = useDefaultConfig()

  const isDrawerVariant = variant === 'drawer'
  const defaultLayoutCopy = getDefaultLayoutCopy(isDrawerVariant)

  const handleReset = useCallback((): void => {
    setHeader(defaultConfig?.theme?.header)
    setContainer(defaultConfig?.theme?.container)
  }, [defaultConfig, setHeader, setContainer])

  const heightControl = useMemo(
    () =>
      !isDrawerVariant ? (
        <HeightControl
          selectedLayoutId={selectedLayoutId}
          setInitialLayout={setInitialLayout}
        />
      ) : null,
    [isDrawerVariant, selectedLayoutId, setInitialLayout]
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
      docsHref={docsLinks.layout}
    >
      <CardSelect
        title={defaultLayoutCopy.title}
        description={defaultLayoutCopy.description}
        selected={selectedLayoutId === 'default'}
        onClick={() => setInitialLayout('default')}
      />
      {LAYOUT_OPTIONS.map(({ id, title, description }) => (
        <CardSelect
          key={id}
          title={title}
          description={description}
          selected={selectedLayoutId === id}
          disabled={isLayoutOptionDisabled(id, variant, isDrawerVariant)}
          onClick={() => setInitialLayout(id)}
          footer={getRestrictedHeightFooter(id)}
        />
      ))}
    </DetailViewLayout>
  )
}
