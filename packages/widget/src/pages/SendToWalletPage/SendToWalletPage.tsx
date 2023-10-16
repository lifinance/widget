import { SendToWallet } from '../../components/SendToWallet';
import { SendToWalletConfirmButton } from '../../components/SendToWalletConfirmButton';
import { PageContainer } from './SendToWalletPage.styled';

export const SendToWalletPage = () => {
  return (
    <PageContainer>
      <SendToWallet />
      <SendToWalletConfirmButton />
    </PageContainer>
  );
};
