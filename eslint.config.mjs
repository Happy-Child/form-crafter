import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import onlyWarn from 'eslint-plugin-only-warn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
    {
        settings: {
            react: {
                version: 'detect',
            },
        },
        languageOptions: { globals: globals.builtin },
    },
    ...tseslint.configs.recommended,
    pluginReactConfig,
    eslintPluginPrettierRecommended,
    {
        plugins: {
            unicorn: eslintPluginUnicorn,
        },
        rules: {
            'unicorn/filename-case': [
                'error',
                {
                    cases: {
                        kebabCase: true,
                        pascalCase: true,
                        camelCase: false,
                        snakeCase: true,
                    },
                },
            ],
        },
    },
    {
        files: ['**/{u,U}{s,S}{e,E}*.{ts,tsx}'],
        rules: {
            'unicorn/filename-case': [
                'error',
                {
                    cases: {
                        camelCase: true,
                    },
                },
            ],
        },
    },
    {
        plugins: {
            'react-hooks': pluginReactHooks,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'error',
        },
    },
    {
        plugins: {
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'simple-import-sort/imports': ['error', { groups: [['^\\u0000'], ['^react$', '^react-dom$'], ['^@?\\w'], ['^_?\\w'], ['^\\.']] }],
            'simple-import-sort/exports': 'error',
        },
    },
    {
        rules: {
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            'react/prop-types': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            'react/no-unknown-property': 'off'
        },
    },
    {
        ignores: ['**/*.mjs', '**/*.cjs', "**/*.js", 'node_modules/*', 'dist/*', 'public/*'],
    },
    {
        plugins: {
            'only-warn': onlyWarn,
        },
    },
]
