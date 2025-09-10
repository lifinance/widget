import { useChainSelect } from '../components/ChainSelect/useChainSelect.js'
import { useChainOrderStore } from '../stores/chains/ChainOrderStore.js'
import type { FormType } from '../stores/form/types.js'

/** This hook returns isAllNetworks value per formType if there are multiple networks.
 * Enabled isAllNetworks for a single available for selection network returns false. */
export const useIsMultipleNetworks = (formType: FormType) => {
  const { chains } = useChainSelect(formType)

  const { getIsAllNetworks } = useChainOrderStore((state) => ({
    getIsAllNetworks: state.getIsAllNetworks,
  }))

  return getIsAllNetworks(formType) && (chains?.length ?? 0) > 1
}
