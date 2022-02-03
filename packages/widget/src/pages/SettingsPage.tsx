import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';

const MainContainer = styled(Container)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflowX: 'clip',
});

export function SettingsPage() {
  const navigate = useNavigate();
  return (
    <MainContainer maxWidth="sm" disableGutters>
      <Box onClick={() => navigate('/', { replace: true })}>Settings</Box>
    </MainContainer>
  );
}
