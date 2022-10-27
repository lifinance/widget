import type { EVMChain } from '@lifi/sdk';
import { Avatar, Container, List, ListItemAvatar } from '@mui/material';
import { useChainSelect } from '../../components/ChainSelect';
import { useNavigateBack } from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';
import { ListItemButton, ListItemText } from './SelectChainPage.style';

export const SelectChainPage: React.FC<SwapFormTypeProps> = ({ formType }) => {
  const { navigateBack } = useNavigateBack();
  const { chains, setCurrentChain } = useChainSelect(formType);

  const handleClick = async (chainId: number) => {
    setCurrentChain(chainId);
    navigateBack();
  };

  return (
    <Container disableGutters>
      <List
        sx={{
          paddingLeft: 1.5,
          paddingRight: 1.5,
        }}
      >
        {chains?.map((chain: EVMChain) => (
          <ListItemButton
            key={chain.id}
            onClick={() => handleClick(chain.id)}
            disableRipple
          >
            <ListItemAvatar>
              <Avatar src={chain.logoURI} alt={chain.name}>
                {chain.name[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={chain.name} />
          </ListItemButton>
        ))}
      </List>
    </Container>
  );
};
