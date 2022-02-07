import { Inbox as InboxIcon } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  DrawerProps,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { routes } from '../utils/routes';

export type SelectTokenDrawerProps = DrawerProps & {
  tokens?: string[];
  containerRef: RefObject<Element>;
};

export interface SelectTokenDrawerBase {
  openDrawer(): void;
  closeDrawer(): void;
}

export const SelectTokenDrawer = forwardRef<
  SelectTokenDrawerBase,
  SelectTokenDrawerProps
>(({ tokens, containerRef }, ref) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const homeMatch = useMatch(routes.home);

  const openDrawer = useCallback(() => {
    navigate(routes.selectToken, { replace: true });
    setOpen(true);
  }, [navigate]);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    navigate(routes.home, { replace: true });
  }, [navigate]);

  useImperativeHandle(
    ref,
    () => ({
      openDrawer,
      closeDrawer,
    }),
    [closeDrawer, openDrawer],
  );

  useEffect(() => {
    if (homeMatch && open) {
      setOpen(false);
    }
  }, [homeMatch, open]);

  const list = () => (
    <Box role="presentation" onClick={closeDrawer} onKeyDown={closeDrawer}>
      <List>
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Test" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Test" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer
      container={containerRef.current}
      anchor="right"
      open={open}
      onClose={closeDrawer}
      ModalProps={{
        sx: { position: 'absolute' },
        // keepMounted: true,
      }}
      PaperProps={{
        sx: {
          position: 'absolute',
          width: '85%',
        },
      }}
      BackdropProps={{
        sx: {
          position: 'absolute',
          backgroundColor: 'rgba(0,0,0,0.12)',
          backdropFilter: 'blur(3px)',
        },
      }}
      SlideProps={{ container: containerRef.current }}
    >
      {list()}
    </Drawer>
  );
});
