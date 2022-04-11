import { Route } from '@lifinance/sdk';
import { UseMutateAsyncFunction } from 'react-query';

export interface SwapExecutionContextProps {
  route?: Route;
  executeRoute: UseMutateAsyncFunction<Route, unknown, Route, unknown>;
}

export interface SwapExecutionProviderProps {}
