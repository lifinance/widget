import SettingsIcon from '@mui/icons-material/Settings';
import { ExpandableCard } from '../../../Card';
import { BookmarkStoreControls } from './BookmarkStoreControls';
import { ViewportColorSelector } from './ViewportColorSelector';

export const PlaygroundSettingsControl = () => {
  return (
    <ExpandableCard
      title={'Playground settings'}
      value={<SettingsIcon />}
      alwaysShowTitleValue
    >
      <ViewportColorSelector sx={{ marginTop: 1 }} />
      <BookmarkStoreControls />
    </ExpandableCard>
  );
};
