import prettier from 'eslint-config-prettier';
import jest from 'eslint-plugin-jest';
import node from 'eslint-plugin-node';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import security from 'eslint-plugin-security';
import sonarjs from 'eslint-plugin-sonarjs';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['scripts.js']),
  // Ignore these directories (files here will not be linted)
  {
    ignores: ['**/node_modules/**', 'dist/**'],
  },

  // Include recommended rules from SonarJS plugin
  sonarjs.configs.recommended,

  {
    // Apply this configuration to all JavaScript files
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest', // ECMAScript version to support
      sourceType: 'module', // Use 'module' for ES modules, 'commonjs' for CommonJS
      globals: {
        // Node + modern JS globals
        ...globals.node,
        ...globals.es2021,
        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
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
