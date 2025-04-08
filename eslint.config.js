// ESLint 기본 및 확장 설정 관련
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

// ESLint 플러그인
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import onlyWarn from 'eslint-plugin-only-warn';

// React 관련 플러그인
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      // 기본 유틸 관련
      'only-warn': onlyWarn,
      prettier: prettierPlugin,

      // import 정리 및 미사용 처리 관련
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,

      // React 및 Hooks 관련
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    rules: {
      // React Hooks 규칙 (이미 포함된 부분도 있지만 명시적으로 유지)
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import 관련 규칙
      'import/no-unresolved': 'off', // Vite alias 고려
      'import/no-named-default': 'error',
      'import/no-default-export': 'error',

      // Import 정렬 (simple-import-sort)
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Unused import / variable 정리
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'unused-imports/no-unused-imports': 'error',

      // React 관련 규칙
      'react/react-in-jsx-scope': 'off', // React 17+
      'react/jsx-uses-react': 'off',

      // React Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Prettier 적용
      'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },

  // config 파일 내 default export 허용
  {
    files: [
      '**/*.config.mjs',
      '**/*.config.js',
      '**/*.config.ts',
      '**/vite.config.*',
      '**/jest.config.*',
      '**/webpack.config.*',
      '**/next.config.*',
    ],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // react-refresh 관련 예외 처리 (shadcn UI 컴포넌트 경로)
  {
    files: ['src/shared/components/ui/**/*.tsx'], // shadcn UI 폴더 예외 처리
    rules: {
      'react-refresh/only-export-components': 'off', // 해당 폴더 내에서 규칙 비활성화
    },
  }
);
