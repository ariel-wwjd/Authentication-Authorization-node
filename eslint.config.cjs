const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: ['node_modules/', 'dist/', 'build/', '*.log', '.git/', '.env', '.DS_Store']
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all'
        }
      ],
      'no-undef': 'error',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info']
        }
      ],
      'prefer-const': 'warn',
      'no-var': 'warn',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'brace-style': ['error', '1tbs'],
      'indent': ['error', 2],
      'quotes': [
        'error',
        'single',
        {
          avoidEscape: true
        }
      ],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': [
        'error',
        {
          max: 2
        }
      ],
      'keyword-spacing': 'error',
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always'
        }
      ],
      'no-multi-spaces': 'error',
      'space-infix-ops': 'error'
    }
  }
];
