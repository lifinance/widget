import {
  createStorage,
  createConfig as createWagmiConfig,
  noopStorage,
} from 'wagmi';

export function createConfig(
  parameters: Parameters<typeof createWagmiConfig>[0],
) {
  return createWagmiConfig({
    storage: createStorage({
      key: 'bigmi',
      storage:
        typeof window !== 'undefined' && window.localStorage
          ? window.localStorage
          : noopStorage,
    }),
    ...parameters,
  });
}
