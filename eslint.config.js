import { defineConfig } from 'eslint/config';
import * as ts from 'typescript-eslint';
import * as angular from 'angular-eslint';
import eslintPluginImport from 'eslint-plugin-import';
import eslintUnusedImports from 'eslint-plugin-unused-imports';
import eslintStylistic from '@stylistic/eslint-plugin';

export default defineConfig(
    {
        basePath: 'projects',
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        extends: [
            ts.configs.recommended,
            ...ts.configs.stylistic,
            ...ts.configs.strictTypeChecked,
            ...angular.configs.tsRecommended,
            eslintPluginImport.flatConfigs.recommended,
            eslintPluginImport.flatConfigs.typescript,
        ],
        plugins: {
            'unused-imports': eslintUnusedImports,
            '@stylistic': eslintStylistic,
        },
        rules: {
            'semi': 'error',
            'prefer-const': 'error',
            'import/prefer-default-export': 'off',
            'import/no-unresolved': 'off',
            'import/first': 'error',
            'import/newline-after-import': 'error',
            'import/no-cycle': ['error', { 'maxDepth': 1 }],
            'no-duplicate-imports': 'error',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    'vars': 'all',
                    'varsIgnorePattern': '^_',
                    'args': 'after-used',
                    'argsIgnorePattern': '^_',
                },
            ],
            'max-len': [
                'error',
                120,
                {
                    'ignorePattern': '^import\\s.+\\sfrom\\s.+;$',
                },
            ],
            'class-methods-use-this': 'off',
            'no-underscore-dangle': 'off',
            'object-curly-newline': [
                'error',
                {
                    'ObjectExpression': { 'multiline': true },
                    'ObjectPattern': { 'multiline': true },
                    'ImportDeclaration': 'never',
                    'ExportDeclaration': 'never',
                },
            ],
            '@stylistic/indent': ['error', 4],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/no-multiple-empty-lines': ['error', { 'max': 1 }],
            'comma-dangle': ['error', 'always-multiline'],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@angular-eslint/directive-selector': [
                'error',
                {
                    'type': 'attribute',
                    'prefix': 'bsa',
                    'style': 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    'type': 'element',
                    'prefix': 'bsa',
                    'style': 'kebab-case',
                },
            ],
        },
    },
    {
        basePath: 'projects',
        files: ['**/*.html'],
        extends: [
            ...angular.configs.templateRecommended,
            ...angular.configs.templateAccessibility,
        ],
    },
);
