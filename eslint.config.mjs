import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import pluginPromise from 'eslint-plugin-promise'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  importPlugin.flatConfigs.typescript,
  pluginPromise.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-redeclare': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      'comma-dangle': ['error', 'always-multiline'],
      'handle-callback-err': ['error', '^(err|error)$'],
      'no-catch-shadow': 'error',
      'no-underscore-dangle': 'off',
      'object-curly-spacing': ['error', 'always'],
      'max-classes-per-file': 'off',
      'no-unused-vars': 'off',
      'no-multi-assign': 'off',
      'lines-between-class-members': 'off',
      'import/prefer-default-export': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'no-shadow': 'off',
      'prefer-destructuring': 'off',
      'no-continue': 'off',
      'no-use-before-define': 'off',
      'no-dupe-class-members': 'off',
      'func-names': 'off',
      'space-before-function-paren': 'off',
      'no-lonely-if': 'off',
      'no-param-reassign': ['error', { props: false }],
      'no-redeclare': 'off',
      'no-restricted-syntax': 'off',
      'no-await-in-loop': 'off',
      'no-console': 'warn',
      'prettier/prettier': 'warn',
      'import/no-extraneous-dependencies': 'off',
    },
  },
)
