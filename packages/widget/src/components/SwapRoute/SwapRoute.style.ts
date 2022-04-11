import { keyframes, styled } from '@mui/material/styles';
import { WaitIcon } from '../../icons/waitIcon';

const rotationAnimation = keyframes`
    0% {
        transform: rotate(0);
    }
    33% {
        transform: rotate(360deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

export const AnimatedWaitIcon = styled(WaitIcon)(({ theme }) => ({
  margin: theme.spacing(1.5),
  transform: 'rotate(0)',
  animation: `${rotationAnimation} 3s infinite cubic-bezier(0.645, 0.045, 0.355, 1.000)`,
}));
