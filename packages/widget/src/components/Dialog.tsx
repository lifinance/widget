import type { DialogProps } from '@mui/material';
import { Dialog as MuiDialog } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { useScrollableContainer } from '../hooks';

export const Dialog: React.FC<PropsWithChildren<DialogProps>> = ({
  children,
  open,
  onClose,
}) => {
  const containerElement = useScrollableContainer();
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      container={containerElement}
      sx={{
        position: 'absolute',
        overflow: 'hidden',
      }}
      PaperProps={{
        sx: (theme) => ({
          position: 'absolute',
          backgroundImage: 'none',
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
        }),
      }}
      BackdropProps={{
        sx: {
          position: 'absolute',
          backgroundColor: 'rgb(0 0 0 / 32%)',
          backdropFilter: 'blur(3px)',
        },
      }}
    >
      {children}
    </MuiDialog>
  );
};
