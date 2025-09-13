module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Ensure subject is not empty
    'subject-empty': [2, 'never'],
    // Limit subject line to 72 characters
    'subject-max-length': [2, 'always', 72],
    // Ensure type is not empty
    'type-empty': [2, 'never'],
    // Define allowed types
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation only changes
        'style', // Changes that don't affect meaning (formatting, etc)
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'perf', // Performance improvements
        'test', // Adding missing tests or correcting existing tests
        'build', // Changes that affect the build system or external dependencies
        'ci', // Changes to CI configuration files and scripts
        'chore', // Other changes that don't modify src or test files
        'revert', // Reverts a previous commit
      ],
    ],
    // Scope is optional but if provided should be lowercase
    'scope-case': [2, 'always', 'lower-case'],
    // Subject should be lowercase
    'subject-case': [2, 'always', 'lower-case'],
    // No period at end of subject
    'subject-full-stop': [2, 'never', '.'],
  },
};
