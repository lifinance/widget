const isSupported = () => {
  try {
    const itemBackup = localStorage.getItem('');
    localStorage.removeItem('');
    if (itemBackup === null) localStorage.removeItem('');
    else localStorage.setItem('', itemBackup);
    return true;
  } catch (e) {
    return false;
  }
};

const storeWallets = (wallets: Array<string>) => {
  if (isSupported()) {
    const lowerCaseWallets = wallets.map((address) => address.toLowerCase());
    localStorage.setItem(
      'wallets',
      JSON.stringify(Array.from(new Set(lowerCaseWallets))),
    );
  }
};

const readWallets = (): Array<string> => {
  if (!isSupported()) {
    return [];
  }
  const walletsString = localStorage.getItem('wallets');
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
  if (isSupported()) {
    const lowerCaseWallets = wallets.map((address) => address.toLowerCase());
    localStorage.setItem(
      'deactivatedWallets',
      JSON.stringify(Array.from(new Set(lowerCaseWallets))),
    );
  }
};

const readDeactivatedWallets = (): Array<string> => {
  if (!isSupported()) {
    return [];
  }
  const walletsString = localStorage.getItem('deactivatedWallets');
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

const removeFromActiveWallets = (address: string | null | undefined) => {
  if (!address) return;
  const lowerCaseAddress = address.toLowerCase();
  const wallets = readWallets();
  const filteredWallets = wallets.filter(
    (address) => address !== lowerCaseAddress,
  );
  storeWallets(filteredWallets);
};

const addToDeactivatedWallets = (address: string | null | undefined) => {
  if (!address) return;
  const lowerCaseAddress = address.toLowerCase();
  const deactivatedWallets = readDeactivatedWallets();
  deactivatedWallets.push(lowerCaseAddress);
  storeDeactivatedWallets(deactivatedWallets);
};

const addToActiveWallets = (address: string | null | undefined) => {
  if (!address) return;
  const lowerCaseAddress = address.toLowerCase();
  const activeWallets = readWallets();
  activeWallets.push(lowerCaseAddress);
  storeWallets(activeWallets);
};

const removeFromDeactivatedWallets = (address: string | null | undefined) => {
  if (!address) return;
  const lowerCaseAddress = address.toLowerCase();
  const deactivatedWallets = readDeactivatedWallets();
  const deactivatedWalletsWithoutAccount = deactivatedWallets.filter(
    (wallet) => wallet !== lowerCaseAddress,
  );
  storeDeactivatedWallets(deactivatedWalletsWithoutAccount);
};

const isWalletDeactivated = (address: string | null | undefined): boolean => {
  if (!address) return false;
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
