import prettierPluginSortImports from '@ianvs/prettier-plugin-sort-imports';

const config = {
  singleQuote: true,
  trailingComma: 'all',
  plugins: [prettierPluginSortImports],
  importOrder: ['^components/(.*)$', '^[./]'],
};

// eslint-disable-next-line import/no-default-export
export default config;
