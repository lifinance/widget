import { Box } from '@mui/material';
import { Drawer, DrawerContentContainer } from './DrawerControls.styles';

interface DrawerControlsProps {
  open: boolean;
}

export const DrawerControls = ({ open }: DrawerControlsProps) => {
  return (
    <Drawer variant="persistent" anchor="left" open={open}>
      <DrawerContentContainer>
        <span>hello</span>
      </DrawerContentContainer>
    </Drawer>
  );
};
