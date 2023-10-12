import type { ButtonProps } from '@mui/material';
import { Box, Button } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';

interface SelectButtonT extends ButtonProps {
  isSelected: boolean;
  theme?: Theme;
}

export const ButtonGroupContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(0.5),
  alignItems: 'center',
  gap: theme.spacing(1),
  justifyContent: 'center',
  backgroundColor: theme.palette.grey[200],
  borderRadius: '12px',
}));

// export const SelectButton = styled(Button)<SelectButtonT>(
//   ({ theme, isSelected }) => ({
//     borderRadius: '12px',
//     flex: 1,
//     backgroundColor: isSelected
//       ? theme.palette.common.white
//       : theme.palette.grey[200],
//     color: isSelected
//       ? theme.palette.common.black
//       : theme.palette.text.secondary,
//     boxShadow: isSelected ? 'none' : '',
//   }),
// );

export const SelectButton = styled(
  ({ isSelected, ...props }: SelectButtonT) => <Button {...props} />,
)(({ theme, isSelected }: SelectButtonT) => ({
  borderRadius: '12px',
  flex: 1,
  backgroundColor: isSelected
    ? theme?.palette.common.white
    : theme?.palette.grey[200],
  color: isSelected ? theme?.palette.common.black : theme?.palette.grey[400],
  '&:hover': {
    backgroundColor: isSelected
      ? theme?.palette.common.white
      : theme?.palette.grey[200],
  },
}));
