module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['general', 'components', 'routing', 'analytics', 'logging', 'auth'],
    ], // * Add new Scope Enums Here
    'type-enum': [
      2,
      'always',
      [
        'config',
        'feat',
        'fix',
        'docs',
        'chore',
        'style',
        'refactor',
        'ci',
        'test',
        'perf',
        'revert',
        'vercel',
      ],
    ],
  },
};
