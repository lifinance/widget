import type { DialogProps, Theme } from '@mui/material';
import { Dialog as MuiDialog } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { useGetScrollableContainer } from '../hooks';

export const modalProps = {
  sx: {
    position: 'absolute',
    overflow: 'hidden',
  },
};

export const paperProps = {
  sx: (theme: Theme) => ({
    position: 'absolute',
    backgroundImage: 'none',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  }),
};

export const backdropProps = {
  sx: {
    position: 'absolute',
    backgroundColor: 'rgb(0 0 0 / 32%)',
    backdropFilter: 'blur(3px)',
  },
};

export const Dialog: React.FC<PropsWithChildren<DialogProps>> = ({
  children,
  open,
  onClose,
}) => {
  const getContainer = useGetScrollableContainer();
  return (
    <MuiDialog
      container={getContainer}
      open={open}
      onClose={onClose}
      sx={modalProps.sx}
      PaperProps={paperProps}
      BackdropProps={backdropProps}
    >
      {children}
    </MuiDialog>
  );
};
