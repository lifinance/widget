import { createContext, PropsWithChildren, useContext } from 'react';

const EnvVariablesContext = createContext({
  EVMWalletConnectId: '',
});

interface EvnVariablesProviderProps extends PropsWithChildren {
  EVMWalletConnectId: string;
}
export const EnvVariablesProvider = ({
  children,
  EVMWalletConnectId,
}: EvnVariablesProviderProps) => {
  return (
    <EnvVariablesContext.Provider value={{ EVMWalletConnectId }}>
      {children}
    </EnvVariablesContext.Provider>
  );
};

export const useEnvVariables = () => {
  return useContext(EnvVariablesContext);
};
