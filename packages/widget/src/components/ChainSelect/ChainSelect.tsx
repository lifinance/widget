/* eslint-disable react/no-array-index-key */
import type { EVMChain } from '@lifi/sdk';
import { Avatar, Box, Skeleton, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { SwapFormTypeProps } from '../../providers';
import { SwapFormKeyHelper } from '../../providers';
import { maxChainToOrder } from '../../stores/chains';
import { navigationRoutes } from '../../utils';
import { ChainCard, ChainContainer } from './ChainSelect.style';
import { useChainSelect } from './useChainSelect';

export const ChainSelect = ({ formType }: SwapFormTypeProps) => {
  const navigate = useNavigate();
  const { chains, getChains, setCurrentChain, isLoading } =
    useChainSelect(formType);
  const [chainId] = useWatch({
    name: [SwapFormKeyHelper.getChainKey(formType)],
  });

  const showAllChains = () => {
    navigate(navigationRoutes[`${formType}Chain`], {
      state: { formType },
    });
  };

  const chainsToHide = (chains?.length ?? 0) - maxChainToOrder;

  return (
    <ChainContainer>
      {isLoading
        ? Array.from({ length: maxChainToOrder + 1 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={56}
              height={56}
              sx={{ borderRadius: 1 }}
            />
          ))
        : getChains().map((chain: EVMChain) => (
            <ChainCard
              key={chain.id}
              onClick={() => setCurrentChain(chain.id)}
              variant={chainId === chain.id ? 'selected' : 'default'}
            >
              <Avatar
                src={chain.logoURI}
                alt={chain.key}
                sx={{ width: 40, height: 40 }}
              >
                {chain.name[0]}
              </Avatar>
            </ChainCard>
          ))}
      {chainsToHide > 0 ? (
        <ChainCard onClick={showAllChains}>
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Typography fontWeight={500}>+{chainsToHide}</Typography>
          </Box>
        </ChainCard>
      ) : null}
    </ChainContainer>
  );
};
