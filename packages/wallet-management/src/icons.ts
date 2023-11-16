export const getWalletIcon = (id: string): string | undefined => {
  switch (id) {
    case 'walletConnect':
      return "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3e %3cradialGradient id='a' cx='0%25' cy='50%25' r='100%25'%3e %3cstop offset='0' stop-color='%235d9df6'/%3e %3cstop offset='1' stop-color='%23006fff'/%3e %3c/radialGradient%3e %3cg fill='none' fill-rule='evenodd'%3e %3cpath fill='url(%23a)' d='M256 0c141.385 0 256 114.615 256 256S397.385 512 256 512 0 397.385 0 256 114.615 0 256 0z'/%3e %3cpath fill='white' fill-rule='nonzero' d='M162.692 197.709c51.533-50.279 135.084-50.279 186.617 0l6.202 6.05a6.327 6.327 0 0 1 0 9.105l-21.216 20.7a3.357 3.357 0 0 1-4.666 0l-8.535-8.328c-35.95-35.075-94.238-35.075-130.188 0l-9.14 8.918a3.357 3.357 0 0 1-4.666 0l-21.216-20.7a6.327 6.327 0 0 1 0-9.104zm230.493 42.809 18.883 18.422a6.327 6.327 0 0 1 0 9.104l-85.142 83.07c-2.577 2.514-6.754 2.514-9.33 0l-60.43-58.957a1.679 1.679 0 0 0-2.332 0l-60.427 58.958c-2.576 2.513-6.754 2.514-9.33 0l-85.145-83.072a6.327 6.327 0 0 1 0-9.104l18.883-18.422c2.576-2.514 6.754-2.514 9.33 0l60.43 58.958a1.679 1.679 0 0 0 2.332 0l60.427-58.958c2.576-2.514 6.754-2.514 9.33 0l60.43 58.958a1.679 1.679 0 0 0 2.332 0l60.428-58.957c2.577-2.514 6.755-2.514 9.331 0z'/%3e %3c/g%3e %3c/svg%3e";
    case 'coinbaseWalletSDK':
      return "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 40 40'%3e %3cpath fill='%231652F0' d='M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20Z'/%3e %3cpath fill='white' fill-rule='evenodd' d='M5.455 20c0 8.034 6.512 14.546 14.546 14.546 8.033 0 14.545-6.512 14.545-14.545 0-8.034-6.512-14.546-14.545-14.546-8.034 0-14.546 6.512-14.546 14.546Zm11.859-4.685a2 2 0 0 0-2 2v5.373a2 2 0 0 0 2 2h5.373a2 2 0 0 0 2-2v-5.373a2 2 0 0 0-2-2h-5.373Z' clip-rule='evenodd'/%3e %3c/svg%3e";
    default:
      break;
  }
};
