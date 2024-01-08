import WalletIcon from '@mui/icons-material/Wallet';
import { WalletAvatarBase } from './SendToWallet.style';

export const WalletAvatar = () => (
  <WalletAvatarBase>
    <WalletIcon sx={{ fontSize: 20 }} />
  </WalletAvatarBase>
);
