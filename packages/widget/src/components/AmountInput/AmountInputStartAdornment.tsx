import { useChain } from '../../hooks/useChain'
import { useToken } from '../../hooks/useToken'
import type { FormTypeProps } from '../../stores/form/types'
import { FormKeyHelper } from '../../stores/form/types'
import { useFieldValues } from '../../stores/form/useFieldValues'
import { AvatarBadgedDefault } from '../Avatar/Avatar'
import { TokenAvatar } from '../Avatar/TokenAvatar'

export const AmountInputStartAdornment: React.FC<FormTypeProps> = ({
  formType,
}) => {
  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType)
  )

  const { chain } = useChain(chainId)
  const { token } = useToken(chainId, tokenAddress)
  const isSelected = !!(chain && token)

  return isSelected ? (
    <TokenAvatar token={token} chain={chain} />
  ) : (
    <AvatarBadgedDefault />
  )
}
