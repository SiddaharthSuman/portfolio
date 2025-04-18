import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import sortKeysPlugin from 'eslint-plugin-sort-keys';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import typescriptSortKeys from 'eslint-plugin-typescript-sort-keys';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import eslintPluginJsonc from 'eslint-plugin-jsonc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Process the Next.js extended configs to remove any duplicate jsx-a11y plugin definitions.
const nextConfigs = compat
  .extends('next/core-web-vitals', 'next/typescript')
  .map((cfg) => {
    if (cfg.plugins && cfg.plugins['jsx-a11y']) {
      delete cfg.plugins['jsx-a11y'];
    }
    return cfg;
  });

const eslintConfig = [
  jsxA11yPlugin.flatConfigs.recommended,
  ...nextConfigs,
  // ...compat.extends('next/core-web-vitals', 'next/typescript'),

  ...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
      },
    },
    plugins: {
      import: importPlugin,
      jsonc: eslintPluginJsonc,
      'react-hooks': reactHooks,
      'sort-destructure-keys': sortDestructureKeys,
      'sort-keys': sortKeysPlugin,
      'typescript-sort-keys': typescriptSortKeys,
    },
    rules: {
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          multiline: 'last',
          reservedFirst: ['key', 'ref'],
          shorthandFirst: true,
        },
      ],
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'sort-destructure-keys/sort-destructure-keys': [
        'warn',
        { caseSensitive: false },
      ],
      'jsonc/sort-keys': [
        'error',
        'asc',
        {
          caseSensitive: true,
          natural: true,
          minKeys: 2,
          allowLineSeparatedGroups: false,
        },
      ],
      'sort-keys': [
        'warn',
        'asc',
        {
          caseSensitive: true,
          minKeys: 2,
          natural: true,
        },
      ],
      'typescript-sort-keys/interface': 'error',
      'typescript-sort-keys/string-enum': 'error',
    },
  },
];

export default eslintConfig;
