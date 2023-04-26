interface PersistedWallet {
  address: string;
  name: string;
}

function isPersistedWallet(object: any): object is PersistedWallet {
  return typeof object.address === 'string' && typeof object.name === 'string';
}
const normalizeWallets = (wallets: PersistedWallet[]) => {
  return wallets.map((wallet) => ({
    address: wallet.address.toLowerCase(),
    name: wallet.name,
  }));
};

const deepEqual = (x: any, y: any): boolean => {
  const ok = Object.keys,
    tx = typeof x,
    ty = typeof y;
  return x && y && tx === 'object' && tx === ty
    ? ok(x).length === ok(y).length &&
        ok(x).every((key) => deepEqual(x[key], y[key]))
    : x === y;
};

const storeWallets = (wallets: PersistedWallet[]) => {
  const normalizedWallets: PersistedWallet[] = normalizeWallets(wallets);
  localStorage.setItem(
    'li.fi-wallets',
    JSON.stringify(Array.from(new Set(normalizedWallets))),
  );
};

const readActiveWallets = (): Array<PersistedWallet> => {
  const walletsString = localStorage.getItem('li.fi-wallets');
  if (walletsString) {
    try {
      const parsedWalletObjects = JSON.parse(walletsString);
      if (
        parsedWalletObjects.some((wallet: any) => !isPersistedWallet(wallet))
      ) {
        throw new Error('Malformed persisted active wallets');
      } else {
        return parsedWalletObjects;
      }
    } catch (e) {
      localStorage.removeItem('li.fi-wallets');
      return [];
    }
  } else {
    return [];
  }
};

const storeDeactivatedWallets = (wallets: PersistedWallet[]) => {
  const normalizedWallets = normalizeWallets(wallets);
  localStorage.setItem(
    'li.fi-deactivated-wallets',
    JSON.stringify(Array.from(new Set(normalizedWallets))),
  );
};

const readDeactivatedWallets = (): PersistedWallet[] => {
  const walletsString = localStorage.getItem('li.fi-deactivated-wallets');
  if (walletsString) {
    try {
      const parsedWalletObjects = JSON.parse(walletsString);
      if (
        parsedWalletObjects.some((wallet: any) => !isPersistedWallet(wallet))
      ) {
        throw new Error('Malformed persisted deactivated wallets');
      } else {
        return parsedWalletObjects;
      }
    } catch (e) {
      localStorage.removeItem('li.fi-deactivated-wallets');
      return [];
    }
  } else {
    return [];
  }
};

const removeFromActiveWallets = (wallet?: PersistedWallet | null) => {
  if (!wallet) {
    return;
  }
  const normalizedWallet = normalizeWallets([wallet])[0];
  const wallets = readActiveWallets();
  const filteredWallets = wallets.filter(
    (wallet) => !deepEqual(wallet, normalizedWallet),
  );
  storeWallets(filteredWallets);
};

const addToDeactivatedWallets = (wallet?: PersistedWallet | null) => {
  if (!wallet) {
    return;
  }
  const normalizedWallet = normalizeWallets([wallet])[0];
  const deactivatedWallets = readDeactivatedWallets();
  deactivatedWallets.push(normalizedWallet);
  storeDeactivatedWallets(deactivatedWallets);
};

const addToActiveWallets = (wallet?: PersistedWallet | null) => {
  if (!wallet) {
    return;
  }
  const normalizedWallet = normalizeWallets([wallet])[0];
  const activeWallets = readActiveWallets();
  activeWallets.push(normalizedWallet);
  storeWallets(activeWallets);
};

const removeFromDeactivatedWallets = (wallet?: PersistedWallet | null) => {
  if (!wallet) {
    return;
  }
  const normalizedWallet = normalizeWallets([wallet])[0];
  const deactivatedWallets = readDeactivatedWallets();
  const deactivatedWalletsWithoutAccount = deactivatedWallets.filter(
    (wallet) => !deepEqual(wallet, normalizedWallet),
  );
  storeDeactivatedWallets(deactivatedWalletsWithoutAccount);
};

const isWalletDeactivated = (wallet?: PersistedWallet | null): boolean => {
  if (!wallet) {
    return true;
  }
  const normalizedWallet = normalizeWallets([wallet])[0];
  const deactivatedWallets = readDeactivatedWallets();
  return deactivatedWallets.some((deactivatedWallet) =>
    deepEqual(deactivatedWallet, normalizedWallet),
  );
};

export {
  removeFromActiveWallets,
  addToDeactivatedWallets,
  addToActiveWallets,
  removeFromDeactivatedWallets,
  isWalletDeactivated,
  readActiveWallets,
};
