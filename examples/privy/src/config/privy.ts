import type { PrivyClientConfig } from '@privy-io/react-auth'

export const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
    requireUserPasswordOnCreate: true,
    showWalletUIs: true,
  },
  loginMethods: ['wallet', 'email', 'sms'],
  appearance: {
    showWalletLoginFirst: true,
    logo: 'https://avatars.githubusercontent.com/u/85288935', // your company logo here
  },
}

export const PRIVY_APP_ID: string = import.meta.env.VITE_PRIVY_APP_ID
