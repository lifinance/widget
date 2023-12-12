import { useChain, useToken } from '../../hooks';
import type { FormTypeProps } from '../../stores';
import { TokenAvatar, TokenAvatarDefault } from '../TokenAvatar';
import { useFieldValues, FormKeyHelper } from '../../stores';

export const AmountInputStartAdornment: React.FC<FormTypeProps> = ({
  formType,
}) => {
  const [chainId, tokenAddress] = useFieldValues(
    FormKeyHelper.getChainKey(formType),
    FormKeyHelper.getTokenKey(formType),
  );

  const { chain } = useChain(chainId);
  const { token } = useToken(chainId, tokenAddress);
  const isSelected = !!(chain && token);

  return isSelected ? (
    <TokenAvatar token={token} chain={chain} sx={{ marginLeft: 2 }} />
  ) : (
    <TokenAvatarDefault sx={{ marginLeft: 2 }} />
  );
};
