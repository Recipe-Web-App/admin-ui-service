# Contributing to Recipe Admin UI Service

Thank you for your interest in contributing to the Recipe Admin UI Service! This document provides
guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/recipe-web-app.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Bun 1.1.0 or higher
- Node.js 20.x or higher (for Angular CLI compatibility)
- Git

### Installation

```bash
# Install dependencies
bun install

# Install pre-commit hooks
pre-commit install

# Start development server
bun run dev
```

### Available Scripts

- `bun run dev` - Start development server with HMR
- `bun run build` - Build for production
- `bun run serve:ssr:admin-ui-service` - Serve SSR build
- `bun run test` - Run unit tests
- `bun run test:e2e` - Run end-to-end tests
- `bun run lint` - Run linting
- `bun run format` - Format code with Prettier

## Making Changes

### Branch Naming

Use descriptive branch names:

- `feature/add-user-management`
- `fix/login-redirect-issue`
- `docs/update-readme`
- `refactor/optimize-queries`

### Commit Messages

We use [Conventional Commits](https://conventionalcommits.org/):

```text
type(scope): description

feat(auth): add OAuth2 integration
fix(ui): resolve sidebar navigation issue
docs(readme): update installation instructions
```

Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

## Submitting Changes

1. Ensure all tests pass: `bun run test`
2. Run linting: `bun run lint`
3. Format code: `bun run format`
4. Push to your fork
5. Create a Pull Request

### Pull Request Guidelines

- Use our [PR template](.github/pull_request_template.md)
- Include tests for new features
- Update documentation as needed
- Ensure CI/CD checks pass
- Request review from maintainers

## Style Guidelines

### TypeScript/Angular

- Follow [Angular Style Guide](https://angular.dev/style-guide)
- Use TypeScript strict mode
- Prefer signals over observables for new code
- Use standalone components
- Follow component naming: `kebab-case` for selectors

### CSS/SCSS

- Use TailwindCSS utility classes
- Follow BEM methodology for custom CSS
- Use CSS custom properties for theming
- Maintain dark mode compatibility

### Testing

- Write unit tests for all business logic
- Use Angular Testing Library for component tests
- Write E2E tests for critical user flows
- Maintain minimum 80% code coverage

### Code Organization

```text
src/app/
├── core/           # Singletons, guards, interceptors
├── shared/         # Reusable components and utilities
├── features/       # Feature modules
└── layout/         # App shell components
```

## Testing Guidelines

### Unit Tests

```bash
bun run test                 # Run once
bun run test:coverage        # With coverage
bun run test:ui              # Interactive UI
```

### E2E Tests

```bash
bun run test:e2e             # Run E2E tests
```

### Writing Tests

- Test behavior, not implementation
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies

## Questions?

- Open an issue for bugs or feature requests
- Join our discussions for questions
- Check existing issues before creating new ones

## Recognition

Contributors will be recognized in our changelog and README. Thank you for making this project better!
