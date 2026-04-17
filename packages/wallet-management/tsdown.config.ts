import { defineConfig, type UserConfig } from 'tsdown'

const defaultConfig: UserConfig = defineConfig({
  entry: ['src/index.ts'],
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
    neverBundle: [/\.json$/],
  },
  copy: [{ from: 'src/i18n/*.json', to: 'dist/esm/i18n', flatten: true }],
})
export default defaultConfig
