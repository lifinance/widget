import SettingsIcon from '@mui/icons-material/Settings'
import { ExpandableCard } from '../../../Card/ExpandableCard.js'
import { PlaygroundControlsContainer } from '../DesignControls.style.js'
import { BookmarkStoreControls } from './BookmarkStoreControls.js'
import { DevViewToggleControls } from './DevViewToggleControl.js'
import { HeaderAndFooterControls } from './HeaderAndFooterControls.js'
import { ViewportColorSelector } from './ViewportColorSelector.js'

export const PlaygroundSettingsControl = () => {
  return (
    <ExpandableCard
      title={'Playground settings'}
      value={<SettingsIcon />}
      alwaysShowTitleValue
      dataTestId="playground-settings-section"
    >
      <PlaygroundControlsContainer>
        <ViewportColorSelector />
        <HeaderAndFooterControls />
        <DevViewToggleControls />
        <BookmarkStoreControls />
      </PlaygroundControlsContainer>
    </ExpandableCard>
  )
}
