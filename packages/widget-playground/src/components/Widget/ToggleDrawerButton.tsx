import type { ButtonProps } from '@mui/material';
import { Button } from '@mui/material';

export function ToggleDrawerButton(props: ButtonProps) {
  return (
    <Button
      variant="contained"
      sx={{ textTransform: 'none', fontWeight: 700, fontSize: 16 }}
      disableElevation
      disableRipple
      {...props}
    >
      Exchange on LI.FI
    </Button>
  );
}
