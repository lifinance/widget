import { useWatch } from 'react-hook-form';
import { useChain, useToken } from '../../hooks';
import type { SwapFormTypeProps } from '../../providers';
import { SwapFormKeyHelper } from '../../providers';
import { TokenAvatar, TokenAvatarDefault } from '../TokenAvatar';

export const SwapInputStartAdornment: React.FC<SwapFormTypeProps> = ({
  formType,
}) => {
  const [chainId, tokenAddress] = useWatch({
    name: [
      SwapFormKeyHelper.getChainKey(formType),
      SwapFormKeyHelper.getTokenKey(formType),
    ],
  });

  const { chain } = useChain(chainId);
  const { token } = useToken(chainId, tokenAddress);
  const isSelected = !!(chain && token);

  return isSelected ? (
    <TokenAvatar token={token} chain={chain} sx={{ marginLeft: 2 }} />
  ) : (
    <TokenAvatarDefault sx={{ marginLeft: 2 }} />
  );
};
