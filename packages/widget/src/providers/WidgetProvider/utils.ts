import type { AllowDeny } from '../../types';

export const isItemAllowed = <T>(itemId: T, items?: AllowDeny<T>) => {
  if (items?.allow?.length) {
    return items.allow.includes(itemId);
  }
  return !items?.deny?.includes(itemId);
};
