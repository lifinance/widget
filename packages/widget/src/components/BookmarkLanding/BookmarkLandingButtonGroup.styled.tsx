import { Box, Button } from '@mui/material';
import type { ButtonProps } from '@mui/material/Button';

import { styled } from '@mui/material/styles';

interface SelectedButtonProps extends ButtonProps {
  selected: string;
}

export const ButtonGroupContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: '4px',
  alignItems: 'center',
  gap: '8px',
  justifyContent: 'center',
  backgroundColor: '#F0F1FC',
  borderRadius: '20px',
}));

export const SelectButton = styled(Button)<SelectedButtonProps>(
  ({ theme, selected }) => ({
    borderRadius: '20px',
    flex: 1,
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
