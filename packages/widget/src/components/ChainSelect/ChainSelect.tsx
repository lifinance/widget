import type { EVMChain } from '@lifi/sdk'
import { Avatar, Box, Skeleton, Tooltip, Typography } from '@mui/material'
import { memo, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useChainOrderStore } from '../../stores/chains/ChainOrderStore.js'
import {
  maxChainsToOrder,
  maxChainsToShow,
  maxGridItemsToShow,
} from '../../stores/chains/createChainOrderStore.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldActions } from '../../stores/form/useFieldActions.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { AllChainsAvatar } from '../Chains/AllChainsAvatar.js'
import { ChainCard, ChainContainer } from './ChainSelect.style.js'
import { useChainSelect } from './useChainSelect.js'

export const ChainSelect = memo(({ formType }: FormTypeProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setFieldValue } = useFieldActions()

  const {
    chainOrder,
    chains,
    getChains,
    isLoading,
    setChainOrder,
    setCurrentChain,
  } = useChainSelect(formType)

  const { isAllNetworks, setIsAllNetworks } = useChainOrderStore((state) => ({
    isAllNetworks: state.isAllNetworks,
    setIsAllNetworks: state.setIsAllNetworks,
  }))

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

  const onChainSelect = useCallback(
    (selectedChainId: number) => {
      setIsAllNetworks(false)
      setCurrentChain(selectedChainId)
    },
    [setIsAllNetworks, setCurrentChain]
  )

  const showAllChains = useCallback(() => {
    navigate(navigationRoutes[`${formType}Chain`])
  }, [navigate, formType])

  const selectAllNetworks = useCallback(() => {
    setIsAllNetworks(true)
    setFieldValue('tokenSearchFilter', '')
  }, [setIsAllNetworks, setFieldValue])

  const chainsToHide = useMemo(() => {
    if (chains?.length === maxChainsToShow) {
      return 0
    }
    return (chains?.length ?? 0) - maxChainsToOrder
  }, [chains])

  const chainsToShow = useMemo(() => {
    return (chainsToHide > 0 ? getChains() : chains) ?? []
  }, [chainsToHide, chains, getChains])

  const showAllNetworks = useMemo(() => chainsToShow.length > 1, [chainsToShow])

  const tilesCount = useMemo(() => {
    return (
      chainsToShow.length +
      (showAllNetworks ? 1 : 0) + // 1 for "All networks"
      (chainsToHide > 0 ? 1 : 0) // 1 for "+ N" more networks
    )
  }, [chainsToShow.length, showAllNetworks, chainsToHide])

  if (isLoading) {
    return (
      <ChainContainer itemCount={tilesCount}>
        {Array.from({ length: maxGridItemsToShow }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={56}
            height={56}
            sx={{ borderRadius: 1 }}
          />
        ))}
      </ChainContainer>
    )
  }

  return (
    <ChainContainer itemCount={tilesCount}>
      {showAllNetworks && (
        <Tooltip title={t('main.allNetworks')} enterNextDelay={100}>
          <ChainCard
            component="button"
            onClick={selectAllNetworks}
            type={isAllNetworks ? 'selected' : 'default'}
            selectionColor="secondary"
          >
            <AllChainsAvatar chains={chains ?? []} size="medium" />
          </ChainCard>
        </Tooltip>
      )}

      {chainsToShow.map((chain: EVMChain) => (
        <ChainItem
          key={chain.id}
          chain={chain}
          isSelected={chainId === chain.id}
          isAllNetworks={isAllNetworks}
          onSelect={onChainSelect}
        />
      ))}

      {chainsToHide > 0 && (
        <ChainCard component="button" onClick={showAllChains}>
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>+{chainsToHide}</Typography>
          </Box>
        </ChainCard>
      )}
    </ChainContainer>
  )
})

const ChainItem = memo(
  ({
    chain,
    isSelected,
    isAllNetworks,
    onSelect,
  }: {
    chain: EVMChain
    isSelected: boolean
    isAllNetworks: boolean
    onSelect: (id: number) => void
  }) => {
    // Memoize the click handler for this chain
    const handleClick = useCallback(
      () => onSelect(chain.id),
      [onSelect, chain.id]
    )

    return (
      <Tooltip title={chain.name} enterNextDelay={100}>
        <ChainCard
          component="button"
          onClick={handleClick}
          type={!isAllNetworks && isSelected ? 'selected' : 'default'}
          selectionColor="secondary"
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
    )
  }
)
