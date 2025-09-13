# Recipe Admin UI Service

[![CI](https://github.com/Recipe-Web-App/admin-ui-service/actions/workflows/pr-check.yml/badge.svg)](https://github.com/Recipe-Web-App/admin-ui-service/actions/workflows/pr-check.yml)
[![Release](https://github.com/Recipe-Web-App/admin-ui-service/actions/workflows/release.yml/badge.svg)](https://github.com/Recipe-Web-App/admin-ui-service/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern Angular 20 admin dashboard for recipe management with server-side rendering (SSR) support.
Built with PrimeNG v20, TailwindCSS v3.4, and comprehensive development tooling.

## ✨ Features

- **Modern Angular 20** with SSR support
- **PrimeNG v20** UI component library with theming
- **TailwindCSS v3.4** for responsive, utility-first styling
- **OAuth2/OIDC** authentication with PKCE
- **Dark/Light mode** theming support
- **Signal-based** state management
- **Comprehensive testing** with Vitest and Playwright
- **Security scanning** with multiple layers of protection
- **CI/CD workflows** with automated testing and deployment

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or 22.x
- npm 11.x or higher
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Recipe-Web-App/admin-ui-service.git
cd admin-ui-service

# Install dependencies
npm install

# Install pre-commit hooks
pre-commit install

# Start development server
npm run dev
```

The application will be available at `http://localhost:4200/` with hot module replacement enabled.

## 📋 Available Scripts

| Script                  | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start development server with HMR    |
| `npm start`             | Start development server             |
| `npm run build`         | Build for production                 |
| `npm run build:ssr`     | Build with server-side rendering     |
| `npm test`              | Run unit tests with Karma            |
| `npm run test:vitest`   | Run unit tests with Vitest           |
| `npm run test:e2e`      | Run end-to-end tests with Playwright |
| `npm run test:coverage` | Run tests with coverage report       |
| `npm run test:ui`       | Interactive test UI                  |
| `npm run lint`          | Run linting                          |
| `npm run lint:fix`      | Fix linting issues                   |
| `npm run format`        | Format code with Prettier            |
| `npm run build:check`   | Type check without build             |
| `npm run analyze`       | Analyze bundle size                  |

## 🏗️ Project Structure

```text
src/app/
├── core/           # Singletons, guards, interceptors
├── shared/         # Reusable components and utilities
├── features/       # Feature modules
└── layout/         # App shell components
```

## 🧪 Testing

### Unit Tests

```bash
npm run test:vitest          # Run once
npm run test:coverage        # With coverage
npm run test:ui             # Interactive UI
```

### E2E Tests

```bash
npm run test:e2e            # Run E2E tests
```

## 🔧 Development

### Code Quality

This project uses comprehensive linting and formatting:

- **ESLint** for TypeScript and Angular code
- **Stylelint** for CSS/SCSS
- **Prettier** for code formatting
- **Pre-commit hooks** for automated checks

### Security

Multiple layers of security scanning:

- **detect-secrets** for secret detection
- **gitleaks** for git history scanning
- **trufflehog** for additional secret detection
- **npm audit** for dependency vulnerabilities
- **CodeQL** for code analysis

## 🚀 Deployment

### Production Build

```bash
npm run build:ssr
```

### Server-Side Rendering

```bash
npm run serve:ssr:admin-ui-service
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests: `npm test`
5. Run linting: `npm run lint`
6. Commit using [Conventional Commits](https://conventionalcommits.org/)
7. Push and create a Pull Request

## 🔒 Security

Security is a top priority. Please see our [Security Policy](SECURITY.md) for reporting vulnerabilities.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🛠️ Technology Stack

- **Framework**: Angular 20 with SSR
- **UI Library**: PrimeNG v20
- **Styling**: TailwindCSS v3.4
- **Authentication**: angular-oauth2-oidc
- **State Management**: Angular Signals with TanStack Query
- **Testing**: Vitest, Playwright, Karma/Jasmine
- **Build Tools**: Angular CLI, esbuild
- **Code Quality**: ESLint, Prettier, Stylelint

## 📈 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## 🆘 Support

- 📖 [Documentation](https://github.com/Recipe-Web-App/admin-ui-service/wiki)
- 🐛 [Report Issues](https://github.com/Recipe-Web-App/admin-ui-service/issues)
- 💬 [Discussions](https://github.com/Recipe-Web-App/admin-ui-service/discussions)

---

Built with ❤️ by the Recipe Web App Team
