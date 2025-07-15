import type { EVMChain } from '@lifi/sdk'
import { Avatar, Box, Skeleton, Tooltip, Typography } from '@mui/material'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useChainOrderStoreContext } from '../../stores/chains/ChainOrderStore.js'
import {
  maxChainsToOrder,
  maxChainsToShow,
  maxGridItemsToShow,
} from '../../stores/chains/createChainOrderStore.js'
import type { FormTypeProps } from '../../stores/form/types.js'
import { FormKeyHelper } from '../../stores/form/types.js'
import { useFieldValues } from '../../stores/form/useFieldValues.js'
import { navigationRoutes } from '../../utils/navigationRoutes.js'
import { AllChainsAvatar } from '../Chains/AllChainsAvatar.js'
import { ChainCard, ChainContainer } from './ChainSelect.style.js'
import { useChainSelect } from './useChainSelect.js'

export const ChainSelect = ({ formType }: FormTypeProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    chainOrder,
    chains,
    getChains,
    isLoading,
    setChainOrder,
    setCurrentChain,
  } = useChainSelect(formType)

  const chainOrderStore = useChainOrderStoreContext()
  const { isAllNetworks, setIsAllNetworks } = chainOrderStore.getState()

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

  const showAllChains = () => {
    navigate(navigationRoutes[`${formType}Chain`])
  }

  // We check if we can accommodate all the chains on the grid
  // The 1st item is "All chains", the rest are individual chains.
  // If there are more than 9 chains we show the number of hidden chains as the last one tile
  const chainsToHide =
    chains?.length === maxChainsToShow
      ? 0
      : (chains?.length ?? 0) - maxChainsToOrder

  // When there is less than 9 chains we don't care about the order
  const chainsToShow = (chainsToHide > 0 ? getChains() : chains) ?? []

  // Number of tiles to show in the grid
  const hasChainsToShow = !!chainsToShow.length
  const tilesCount =
    chainsToShow.length +
    (hasChainsToShow ? 1 : 0) + // 1 for "All chains"
    (chainsToHide > 0 ? 1 : 0) // 1 for "+ N" more chains

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
      {isLoading ? (
        Array.from({ length: maxChainsToOrder }).map((_, index) => (
          <Skeleton
            key={index}
            variant="rectangular"
            width={56}
            height={56}
            sx={{ borderRadius: 1 }}
          />
        ))
      ) : (
        <>
          {hasChainsToShow && (
            <Tooltip title={t('main.allNetworks')} enterNextDelay={100}>
              <ChainCard
                component="button"
                onClick={() => setIsAllNetworks(true)}
                type={isAllNetworks ? 'selected' : 'default'}
                selectionColor="secondary"
              >
                <AllChainsAvatar chains={chainsToShow} size="medium" />
              </ChainCard>
            </Tooltip>
          )}
          {chainsToShow?.map((chain: EVMChain) => (
            <Tooltip key={chain.id} title={chain.name} enterNextDelay={100}>
              <ChainCard
                component="button"
                onClick={() => {
                  setIsAllNetworks(false)
                  setCurrentChain(chain.id)
                }}
                type={
                  !isAllNetworks && chainId === chain.id
                    ? 'selected'
                    : 'default'
                }
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
          ))}
        </>
      )}
      {chainsToHide > 0 ? (
        <ChainCard component="button" onClick={showAllChains}>
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
              }}
            >
              +{chainsToHide}
            </Typography>
          </Box>
        </ChainCard>
      ) : null}
    </ChainContainer>
  )
}
