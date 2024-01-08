import { shallow } from 'zustand/shallow';
import {
  BookmarksActionFunctions,
  BookmarksActionNames,
  BookmarksActions,
} from './types';
import { useBookmarksStore } from './BookmarksStore';

const actionFunctions: BookmarksActionNames[] = [
  'addBookmarkedWallet',
  'removeBookmarkedWallet',
  'setSelectedBookmarkWallet',
  'addRecentWallet',
  'removeRecentWallet',
];

export const useBookmarksActions = () => {
  const actions: BookmarksActionFunctions = useBookmarksStore(
    (store) => actionFunctions.map((actionName) => store[actionName]),
    shallow,
  );

  return actions.reduce(
    (accum, actionName, i) => ({ ...accum, [actionFunctions[i]]: actionName }),
    {},
  ) as BookmarksActions;
};
