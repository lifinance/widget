// import { FlatCompat } from '@eslint/eslintrc';
import { eslintBaseConfig } from './eslint.config.base.js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

// set up for compat.extends('') - this can be used to add config in a legacy style.
// import * as path from 'path';
// import { fileURLToPath } from 'url';
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const compat = new FlatCompat({ resolvePluginsRelativeTo: __dirname });

export default [
  eslintPluginPrettierRecommended,
  eslintBaseConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
  },
];
