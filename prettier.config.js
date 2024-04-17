import prettierPluginSortImports from '@trivago/prettier-plugin-sort-imports';

const config = {
  singleQuote: true,
  trailingComma: 'all',
  plugins: [prettierPluginSortImports],
  importOrder: ['^components/(.*)$', '^[./]'],
  importOrderSortSpecifiers: true,
};

export default config;
