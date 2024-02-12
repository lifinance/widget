/* eslint-disable react/no-array-index-key */
import type { EVMChain } from '@lifi/sdk';
import { Avatar, Box, Skeleton, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { maxChainToOrder } from '../../stores/chains/createChainOrderStore.js';
import type { FormTypeProps } from '../../stores/form/types.js';
import { FormKeyHelper } from '../../stores/form/types.js';
import { useFieldValues } from '../../stores/form/useFieldValues.js';
import { navigationRoutes } from '../../utils/navigationRoutes.js';
import { ChainCard, ChainContainer } from './ChainSelect.style.js';
import { useChainSelect } from './useChainSelect.js';

export const ChainSelect = ({ formType }: FormTypeProps) => {
  const navigate = useNavigate();
  const {
    chainOrder,
    chains,
    getChains,
    isLoading,
    setChainOrder,
    setCurrentChain,
  } = useChainSelect(formType);

  const [chainId] = useFieldValues(FormKeyHelper.getChainKey(formType));

  useEffect(() => {
    if (chainId) {
      const hasChainInOrderedList = chainOrder.includes(chainId);
      // If we don't have a chain in the ordered chain list we should add it.
      if (!hasChainInOrderedList) {
        setChainOrder(chainId, formType);
      }
    }
  }, [chainId, chainOrder, formType, setChainOrder]);

  const showAllChains = () => {
    navigate(navigationRoutes[`${formType}Chain`]);
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
            <Tooltip
              key={chain.id}
              title={chain.name}
              placement="top"
              enterDelay={400}
              arrow
            >
              <ChainCard
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
            </Tooltip>
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
