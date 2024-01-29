import { TabContentContainer } from '@/app/components/DrawerControls/DrawerControls.styles';
import { TabPanelProps } from '@mui/lab/TabPanel/TabPanel';

export const CodeControls = (props: TabPanelProps) => {
  return (
    <TabContentContainer {...props}>
      <p>Code controls</p>
    </TabContentContainer>
  );
};
