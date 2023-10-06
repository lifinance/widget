import { Box, Button } from '@mui/material';
import type { ButtonProps } from '@mui/material/Button';

import { styled } from '@mui/material/styles';

interface SelectedButtonProps extends ButtonProps {
  selected: string;
}

export const BoxContainer = styled(Box)(({ theme }) => ({
  borderRadius: '2px',
  display: 'inline-block',
  padding: theme.spacing(2),
  width: '100%',
}));

export const SelectedButton = styled(Button)<SelectedButtonProps>(
  ({ theme, selected }) => ({
    borderRadius: '20px',
    backgroundColor:
      selected === 'Custom' || selected === 'Bookmarks'
        ? 'white'
        : theme.palette.grey[300],
    color:
      selected === 'Custom' || selected === 'Bookmarks'
        ? theme.palette.common.black
        : theme.palette.text.secondary,
    boxShadow: selected === 'Custom' || selected === 'Bookmarks' ? 'none' : '',
  }),
);
