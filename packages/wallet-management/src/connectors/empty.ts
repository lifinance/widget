import { initializeConnector } from '@web3-react/core';
import type { Empty } from '@web3-react/empty';
import { EMPTY } from '@web3-react/empty';

export const [empty, hooks] = initializeConnector<Empty>(() => EMPTY);
