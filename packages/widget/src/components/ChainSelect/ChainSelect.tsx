import type { EVMChain } from '@lifi/sdk'
import { Skeleton, Tooltip } from '@mui/material'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  maxChainsToOrder,
  maxChainsToShow,
} from '../../stores/chains/createChainOrderStore.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import {
  ChainAvatar,
  ChainCard,
  ChainContainer,
  MoreChainsBox,
  MoreChainsText,
} from './ChainSelect.style.js'
import { useChainSelect } from './useChainSelect.js'

export const ChainSelect = memo(({ formType }: FormTypeProps) => {
  const navigate = useNavigate()
  const {
    chainOrder,
    chains,
    getChains,
    isLoading,
    setChainOrder,
    setCurrentChain,
  } = useChainSelect(formType)

  const [chainId] = useFieldValues(FormKeyHelper.getChainKey(formType))

  useEffect(() => {
    if (chainId) {
      const hasChainInOrderedList = chainOrder.includes(chainId)
      // If we don't have a chain in the ordered chain list we should add it.
      if (!hasChainInOrderedList) {
        setChainOrder(chainId, formType)
      }
    }
  }, [chainId, chainOrder, formType, setChainOrder])

  const showAllChains = useCallback(() => {
    navigate(navigationRoutes[`${formType}Chain`])
  }, [navigate, formType])

  const { chainsToHide, chainsToShow, tilesCount } = useMemo(() => {
    // We check if we can accommodate all the chains on the grid
    // If there are more than 10 chains we show the number of hidden chains as the last one tile
    const chainsToHide =
      chains?.length === maxChainsToShow
        ? 0
        : (chains?.length ?? 0) - maxChainsToOrder

    // When there is less than 10 chains we don't care about the order
    const chainsToShow = chainsToHide > 0 ? getChains() : chains

    // Number of tiles to show in the grid
    const tilesCount = (chainsToShow?.length ?? 0) + (chainsToHide > 0 ? 1 : 0)

    return { chainsToHide, chainsToShow, tilesCount }
  }, [chains, getChains])

  return (
    <ChainContainer itemCount={tilesCount}>
      {isLoading
        ? Array.from({ length: maxChainsToOrder }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={56}
              height={56}
              sx={{ borderRadius: 1 }}
            />
          ))
        : chainsToShow?.map((chain: EVMChain) => (
            <Tooltip key={chain.id} title={chain.name} enterNextDelay={100}>
              <ChainCard
                component="button"
                onClick={() => setCurrentChain(chain.id)}
                type={chainId === chain.id ? 'selected' : 'default'}
                selectionColor="secondary"
              >
                <ChainAvatar src={chain.logoURI} alt={chain.key}>
                  {chain.name[0]}
                </ChainAvatar>
              </ChainCard>
            </Tooltip>
          ))}
      {chainsToHide > 0 ? (
        <ChainCard component="button" onClick={showAllChains}>
          <MoreChainsBox>
            <MoreChainsText>+{chainsToHide}</MoreChainsText>
          </MoreChainsBox>
        </ChainCard>
      ) : null}
    </ChainContainer>
  )
})
