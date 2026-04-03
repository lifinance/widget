import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/handlers/ethereum/index.ts',
    'src/handlers/solana/index.ts',
    'src/handlers/bitcoin/index.ts',
    'src/handlers/sui/index.ts',
  ],
  outDir: 'dist/esm',
  format: 'esm',
  unbundle: true,
  dts: { sourcemap: true },
  sourcemap: true,
  target: 'es2020',
  logLevel: 'warn',
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  deps: {
    skipNodeModulesBundle: true,
  },
})
