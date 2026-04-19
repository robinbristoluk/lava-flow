import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import litPlugin from 'eslint-plugin-lit'
import wcPlugin from 'eslint-plugin-wc'

export default tseslint.config(
  {
    ignores: ['dist/**', 'storybook-static/**', 'coverage/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      lit: litPlugin,
      wc: wcPlugin,
    },
    rules: {
      ...litPlugin.configs.recommended.rules,
      ...wcPlugin.configs['flat/recommended'].rules,
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  }
)
