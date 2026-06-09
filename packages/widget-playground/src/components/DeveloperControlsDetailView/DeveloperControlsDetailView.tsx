import { Box, Collapse } from '@mui/material'
import type { JSX } from 'react'
import { useCallback, useState } from 'react'
import { useDevView } from '../../hooks/useDevView.js'
import { useWidgetEventConsoleLogging } from '../../hooks/useWidgetEventConsoleLogging.js'
import { useEditToolsActions } from '../../store/editTools/useEditToolsActions.js'
import { useHeaderAndFooterToolValues } from '../../store/editTools/useHeaderAndFooterToolValues.js'
import { useSkeletonToolValues } from '../../store/editTools/useSkeletonToolValues.js'
import { useWidgetEventMonitorValues } from '../../store/editTools/useWidgetEventMonitorValues.js'
import {
  useConfigContainer,
  useConfigVariant,
} from '../../store/widgetConfig/useConfigValues.js'
import {
  clearPlaygroundBookmarkStores,
  readPlaygroundBookmarksSeeded,
  seedPlaygroundBookmarkStores,
} from '../../utils/bookmarkStores.js'
import { docsLinks } from '../../utils/docsLinks.js'
import { isFullHeightLayout } from '../../utils/layout.js'
import { Content, Title, TitleSection } from '../DetailView/DetailView.style.js'
import { DetailViewHeader } from '../DetailView/DetailViewHeader.js'
import {
  SlideViewPanel,
  SlideViewTrack,
} from '../DetailView/SlideView.style.js'
import { DocsLink } from '../DocsLink/DocsLink.js'
import { Switch } from '../Switch.style.js'
import {
  ConfigureLink,
  NestedToggleLabel,
  NestedToggleRow,
  ToggleSection,
} from './DeveloperControlsDetailView.style.js'
import { DeveloperToggleItem } from './DeveloperToggleItem.js'
import { FormValuesControls } from './FormValuesControls.js'
import { WidgetEventsDetailView } from './WidgetEventsDetailView.js'

type DeveloperControlsSection = 'main' | 'widget-events'

interface DeveloperControlsDetailViewProps {
  onBack: () => void
}

export const DeveloperControlsDetailView = ({
  onBack,
}: DeveloperControlsDetailViewProps): JSX.Element => {
  const { isDevView, toggleDevView } = useDevView()
  const { isSkeletonShown } = useSkeletonToolValues()
  const { showMockHeader, showMockFooter, isFooterFixed } =
    useHeaderAndFooterToolValues()
  const { container } = useConfigContainer()
  const { variant } = useConfigVariant()
  const isDrawerVariant = variant === 'drawer'
  const isFullHeight = isFullHeightLayout(container)
  const isSkeletonEnabled = !isDrawerVariant
  const {
    setSkeletonShow,
    setHeaderVisibility,
    setFooterVisibility,
    setFixedFooter,
  } = useEditToolsActions()
  const { monitoredEvents } = useWidgetEventMonitorValues()

  const [activeSection, setActiveSection] =
    useState<DeveloperControlsSection>('main')
  const [bookmarksSeeded, setBookmarksSeeded] = useState(() =>
    readPlaygroundBookmarksSeeded()
  )

  useWidgetEventConsoleLogging(monitoredEvents)

  const handleBookmarkStoresChange = useCallback(
    (_: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
      if (checked) {
        seedPlaygroundBookmarkStores()
      } else {
        clearPlaygroundBookmarkStores()
      }
      setBookmarksSeeded(checked)
    },
    []
  )

  return (
    <SlideViewTrack showSecondary={activeSection === 'widget-events'}>
      <SlideViewPanel>
        <DetailViewHeader onBack={onBack} />
        <Content sx={{ gap: 0 }}>
          <TitleSection>
            <Title>Developer controls</Title>
            <DocsLink href={docsLinks.configure} />
          </TitleSection>
          <ToggleSection>
            <DeveloperToggleItem
              leadingDivider={false}
              label="Form values"
              description="Used for testing prefilled routes and values. It will update the widget's form and URL."
              checked={isDevView}
              onChange={() => toggleDevView()}
              ariaLabel="Toggle form values"
            >
              <Collapse in={isDevView}>
                <Box sx={{ pt: 1.5 }}>
                  <FormValuesControls />
                </Box>
              </Collapse>
            </DeveloperToggleItem>
            <DeveloperToggleItem
              label="Bookmark stores"
              description='Toggle to seed or clear dummy wallet addresses for testing the "Bookmarked wallets" screen. The page will reload.'
              checked={bookmarksSeeded}
              onChange={handleBookmarkStoresChange}
              ariaLabel="Toggle bookmark stores seed data"
            />
            <DeveloperToggleItem
              label="Loading preview"
              description="Preview the skeleton loader to see how the widget will look while data is loading. Best with compact and wide variants."
              checked={isSkeletonShown}
              onChange={() => setSkeletonShow(!isSkeletonShown)}
              disabled={!isSkeletonEnabled}
              ariaLabel="Toggle loading preview"
            />
            <DeveloperToggleItem
              label="Mock header"
              description="Show a mock header element above the widget. Only available for compact variant in full-height layout."
              checked={showMockHeader}
              onChange={(_, checked) => setHeaderVisibility(checked)}
              disabled={!isFullHeight}
              ariaLabel="Toggle mock header"
            />
            <DeveloperToggleItem
              label="Mock footer"
              description="Show a mock footer element below the widget. Only available for compact variant in full-height layout."
              checked={showMockFooter}
              onChange={(_, checked) => {
                setFooterVisibility(checked)
              }}
              disabled={!isFullHeight}
              ariaLabel="Toggle mock footer"
            >
              <Collapse in={showMockFooter && isFullHeight}>
                <NestedToggleRow>
                  <NestedToggleLabel>
                    Stick to viewport bottom
                  </NestedToggleLabel>
                  <Switch
                    size="small"
                    checked={isFooterFixed}
                    onChange={(_, checked) => {
                      setFixedFooter(checked)
                    }}
                    aria-label="Toggle fixed footer"
                  />
                </NestedToggleRow>
              </Collapse>
            </DeveloperToggleItem>
            <DeveloperToggleItem
              label="Widget events"
              description="Widget event listeners to log activity in your browser console for debugging."
              hideSwitch
            >
              <ConfigureLink
                disableRipple
                type="button"
                onClick={() => setActiveSection('widget-events')}
              >
                Configure
              </ConfigureLink>
            </DeveloperToggleItem>
          </ToggleSection>
        </Content>
      </SlideViewPanel>
      {activeSection === 'widget-events' ? (
        <WidgetEventsDetailView onBack={() => setActiveSection('main')} />
      ) : null}
    </SlideViewTrack>
  )
}
