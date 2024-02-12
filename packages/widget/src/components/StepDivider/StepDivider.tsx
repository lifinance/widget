import { Divider } from '@mui/material';
import { Container } from './StepDivider.style.js';

export const StepDivider: React.FC = () => {
  return (
    <Container>
      <Divider orientation="vertical" flexItem />
    </Container>
  );
};
