# Pull Request

## Description

<!-- Provide a clear and concise description of the changes in this PR -->

## Type of Change

Please check the type of change your PR introduces:

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] 🎨 Style/UI changes (formatting, styling, no functional changes)
- [ ] ♻️ Code refactoring (no functional changes)
- [ ] ⚡ Performance improvements
- [ ] ✅ Test changes
- [ ] 🔧 Build/CI changes
- [ ] 🔒 Security improvements
- [ ] 📦 Dependency updates

## Related Issues

<!-- Link related issues using keywords to auto-close them -->

Fixes #
Closes #
Related to #

## Changes Made

<!-- List the specific changes made in this PR -->

-
-
-

## Security Impact

- [ ] This PR has NO security implications
- [ ] This PR may have security implications (please explain below)

<!-- If security implications exist, describe them -->

## Breaking Changes

- [ ] This PR introduces NO breaking changes
- [ ] This PR introduces breaking changes (describe below)

<!-- If breaking changes exist, describe the migration path -->

## Testing

### Test Coverage

- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass locally

### Manual Testing Performed

<!-- Describe the manual testing you performed -->

**Test Environment:**

- Browser(s):
- OS:
- Node version:

**Test Steps:**

1.
2.
3.

## Performance Impact

- [ ] No performance impact
- [ ] Performance improved (describe below)
- [ ] Performance may be affected (describe below)

<!-- Provide metrics if applicable (bundle size, load time, etc.) -->

## Browser Compatibility

Tested on:

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile browsers

## Accessibility

- [ ] No accessibility changes
- [ ] Accessibility improved
- [ ] Accessibility considerations documented

## Configuration Changes

- [ ] No configuration changes
- [ ] Environment variables added/changed (document in .env.example)
- [ ] Build configuration updated
- [ ] Package dependencies updated

## Database/Storage Changes

- [ ] No database/storage changes
- [ ] Schema changes (describe below)
- [ ] Migration required (provide migration steps)

## Deployment Notes

<!-- Special deployment considerations, if any -->

- [ ] No special deployment steps required
- [ ] Requires deployment steps (describe below)

## Documentation

- [ ] README updated
- [ ] .github/TECHNICAL_SPEC updated
- [ ] Code comments added
- [ ] API documentation updated
- [ ] No documentation changes needed

## Pre-Review Checklist

### Code Quality

- [ ] Code follows project style guidelines
- [ ] Self-review performed
- [ ] Code is well-commented
- [ ] No console.log or debug code left
- [ ] No hardcoded values (use environment variables)

### Test Execution

- [ ] `npm run test:vitest` passes
- [ ] `npm run test:e2e` passes
- [ ] `npm run lint` passes
- [ ] `npm run format:check` passes
- [ ] `npm run build` succeeds

### Angular Best Practices

- [ ] Components use OnPush change detection (where applicable)
- [ ] Proper use of Signals for state management
- [ ] No memory leaks (subscriptions properly managed)
- [ ] Lazy loading implemented (where applicable)
- [ ] SSR compatibility verified

### Security

- [ ] No secrets or API keys in code
- [ ] Input validation implemented
- [ ] XSS protection verified
- [ ] Authentication/authorization checked
- [ ] CSRF protection maintained

## Screenshots/Videos

<!-- Add screenshots or videos to demonstrate UI changes -->

### Before

### After

## Reviewer Notes

<!-- Anything specific you want reviewers to focus on? -->

## **Areas requesting special attention:**

-

## Additional Context

<!-- Any other information that would help reviewers -->

---

**Generated with [Claude Code](https://claude.com/claude-code)**

Co-Authored-By: Claude <noreply@anthropic.com>
