import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';
import node from 'eslint-plugin-node';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // Ignore these directories (files here will not be linted)
  {
    ignores: ['**/node_modules/**', 'dist/**'],
  },

  // Include recommended rules from SonarJS plugin
  sonarjs.configs.recommended,

  {
    // Apply this configuration to all JavaScript files
    files: ['**/*.ts', '**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      // The ECMAScript version to support. 'latest' enables the newest JavaScript syntax.

      sourceType: 'module',
      // Type of JavaScript source code.
      // 'module' for ES modules, 'commonjs' for CommonJS modules.

      globals: {
        // Global variables available during linting.
        ...globals.browser, // standard browser globals (e.g., window, document)
        ...globals.es2021, // ES2021 globals (e.g., BigInt, globalThis)
        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        global: 'readonly',
        Buffer: 'readonly',
      },

      parser: typescriptParser,
      // The parser ESLint should use.
      // Must provide parse() or parseForESLint() methods.
      // Default is 'espree'; legacy projects might use Babel instead.

      parserOptions: {
        // Additional options passed directly to the parser
        ecmaFeatures: {
          jsx: true, // Enable parsing of JSX syntax (React or similar)
        },
      },
    },

    plugins: {
      prettier: eslintPluginPrettier, // Prettier integration
      jest, // Jest testing rules
      security, // Security-related rules
      unicorn, // Modern JS best practices
      node, // Node.js specific rules
    },

    rules: {
      // ========================
      // Prettier Integration
      // ========================
      'prettier/prettier': 'error', // Treat Prettier formatting issues as ESLint errors

      // ========================
      // TypeScript
      // ========================
      '@typescript-eslint/no-explicit-any': 'warn',
      // Warns when you use the `any` type. Helps you minimize using `any` and keep type safety.

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
        // Throws an error for unused variables.
        // Exception: function arguments that start with '_' are ignored.
      ],

      // ========================
      // Modern JS Style
      // ========================
      'prefer-const': 'error', // Prefer const for variables that aren’t reassigned
      'no-var': 'error', // Disallow var
      'arrow-body-style': ['error', 'as-needed'], // Only use braces when needed
      'object-shorthand': 'error', // Use shorthand for object properties
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }], // Limit empty lines

      // ========================
      // Safety & Best Practices
      // ========================
      eqeqeq: ['error', 'always'], // Always use ===
      'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn for console.log
      'no-debugger': 'warn', // Warn for debugger
      'no-unused-vars': 'error', // Warn for unused variables
      'no-undef': 'error', // Warn for undefined variables

      // ========================
      // Jest Testing Rules
      // ========================
      'jest/no-disabled-tests': 'warn', // Warn for skipped tests
      'jest/no-focused-tests': 'error', // Prevent focused tests (only/focus)
      'jest/no-identical-title': 'error', // Prevent duplicate test titles
      'jest/prefer-to-have-length': 'warn', // Recommend using `.toHaveLength()`
      'jest/valid-expect': 'error', // Ensure `expect` usage is valid

      // ========================
      // Security Rules
      // ========================
      'security/detect-object-injection': 'warn', // Warn for object injection vulnerabilities
      'security/detect-non-literal-require': 'warn', // Warn on dynamic require
      'security/detect-eval-with-expression': 'error', // Disallow eval

      // ========================
      // Code Quality (SonarJS)
      // ========================
      'sonarjs/cognitive-complexity': 'warn', // Warn if function is too complex
      'sonarjs/no-identical-expressions': 'warn', // Prevent repeated expressions
      'sonarjs/pseudo-random': 'warn', // Warn on unsafe pseudo-random usage

      // ========================
      // Modern JavaScript (Unicorn)
      // ========================
      'unicorn/prefer-module': 'error', // Prefer ESM modules
      'unicorn/prefer-ternary': 'error', // Prefer ternary operators when appropriate
      'unicorn/prefer-node-protocol': 'error', // Use Node.js URL protocol explicitly
    },
  },

  // Prevent conflicts with Prettier formatting rules
  prettier,
]);
