import { useState } from 'react';
import { Tabs, Tab } from '../Tabs';
import TabContext from '@mui/lab/TabContext';
import { Drawer, DrawerContentContainer } from './DrawerControls.styles';
import { DesignControls } from './DesignControls';
import { CodeControls } from './CodeControls';

interface DrawerControlsProps {
  open: boolean;
}

export const DrawerControls = ({ open }: DrawerControlsProps) => {
  const [controlsTabsState, setControlsTabsState] = useState<'design' | 'code'>(
    'design',
  );

  return (
    <Drawer variant="persistent" anchor="left" open={open}>
      <DrawerContentContainer>
        <Tabs
          value={controlsTabsState}
          aria-label="tabs"
          indicatorColor="primary"
          onChange={(_, value) => setControlsTabsState(value)}
        >
          <Tab label={'Design'} value="design" disableRipple />
          <Tab label={'Code'} value="code" disableRipple />
        </Tabs>
        <TabContext value={controlsTabsState}>
          <DesignControls value="design" />
          <CodeControls value="code" />
        </TabContext>
      </DrawerContentContainer>
    </Drawer>
  );
};
