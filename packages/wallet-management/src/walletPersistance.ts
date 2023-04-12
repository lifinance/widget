const storeWallets = (wallets: Array<string>) => {
  const lowerCaseWallets = wallets.map((address) => address.toLowerCase());
  localStorage.setItem(
    'li.fi-wallets',
    JSON.stringify(Array.from(new Set(lowerCaseWallets))),
  );
};

const readWallets = (): Array<string> => {
  const walletsString = localStorage.getItem('li.fi-wallets');
  if (walletsString) {
    try {
      return JSON.parse(walletsString);
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
};

const storeDeactivatedWallets = (wallets: string[]) => {
  const lowerCaseWallets = wallets.map((address) => address.toLowerCase());
  localStorage.setItem(
    'li.fi-deactivated-wallets',
    JSON.stringify(Array.from(new Set(lowerCaseWallets))),
  );
};

const readDeactivatedWallets = (): Array<string> => {
  const walletsString = localStorage.getItem('li.fi-deactivated-wallets');
  if (walletsString) {
    try {
      return JSON.parse(walletsString);
    } catch (e) {
      return [];
    }
  } else {
    return [];
  }
};

const removeFromActiveWallets = (address?: string | null) => {
  if (!address) {
    return;
  }
  const lowerCaseAddress = address.toLowerCase();
  const wallets = readWallets();
  const filteredWallets = wallets.filter(
    (address) => address !== lowerCaseAddress,
  );
  storeWallets(filteredWallets);
};

const addToDeactivatedWallets = (address?: string | null) => {
  if (!address) {
    return;
  }
  const lowerCaseAddress = address.toLowerCase();
  const deactivatedWallets = readDeactivatedWallets();
  deactivatedWallets.push(lowerCaseAddress);
  storeDeactivatedWallets(deactivatedWallets);
};

const addToActiveWallets = (address?: string | null) => {
  if (!address) {
    return;
  }
  const lowerCaseAddress = address.toLowerCase();
  const activeWallets = readWallets();
  activeWallets.push(lowerCaseAddress);
  storeWallets(activeWallets);
};

const removeFromDeactivatedWallets = (address?: string | null) => {
  if (!address) {
    return;
  }
  const lowerCaseAddress = address.toLowerCase();
  const deactivatedWallets = readDeactivatedWallets();
  const deactivatedWalletsWithoutAccount = deactivatedWallets.filter(
    (wallet) => wallet !== lowerCaseAddress,
  );
  storeDeactivatedWallets(deactivatedWalletsWithoutAccount);
};

const isWalletDeactivated = (address?: string | null): boolean => {
  if (!address) {
    return true;
  }
  const lowerCaseAddress = address.toLowerCase();
  const deactivatedWallets = readDeactivatedWallets();
  const deactivatedAddresses = deactivatedWallets.map((address) =>
    address.toLowerCase(),
  );
  return deactivatedAddresses.includes(lowerCaseAddress);
};

export {
  removeFromActiveWallets,
  addToDeactivatedWallets,
  addToActiveWallets,
  removeFromDeactivatedWallets,
  isWalletDeactivated,
};
