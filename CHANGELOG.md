# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0 (2026-02-02)


### Features

* **admin-ui:** added hello world page ([ecfad90](https://github.com/Recipe-Web-App/admin-ui-service/commit/ecfad90dd8c0ae9afb6f86d32bf27fa6ea6bcad5))
* **admin-ui:** created angular project ([cf74dc0](https://github.com/Recipe-Web-App/admin-ui-service/commit/cf74dc0f910d5d4fbf3e0cb79b64a68a058ff47e))
* **deploy:** added deployment scripts ([e180dc2](https://github.com/Recipe-Web-App/admin-ui-service/commit/e180dc2783821dfa3bd65f158d4d0760511fb2f8))
* **deploy:** added docker setup ([8c016f3](https://github.com/Recipe-Web-App/admin-ui-service/commit/8c016f3c3bbc2b3fdfdafea17e2f07f1e2f00b8f))
* **deploy:** added endpoints for kubernetes live/ready probes ([4fb4a59](https://github.com/Recipe-Web-App/admin-ui-service/commit/4fb4a5921d239fc7bfc13410f5eab1eaba0a7a9b))
* **deploy:** added kubernetes manifests ([2f77152](https://github.com/Recipe-Web-App/admin-ui-service/commit/2f77152c1c501280640963e23bc6fc0dc4b2888c))
* **oauth2:** integrated with auth-service for oauth2 ([868582c](https://github.com/Recipe-Web-App/admin-ui-service/commit/868582c09127b755f646dc7d7634ed953878fe06))


### Bug Fixes

* **deploy:** fixed compatibility issues with new depend upgrades ([10c821d](https://github.com/Recipe-Web-App/admin-ui-service/commit/10c821dfb15ec26aefa35c3a2b78b4f24e1832f4))
* **deploy:** fixed k8s probe uri's ([3155e94](https://github.com/Recipe-Web-App/admin-ui-service/commit/3155e94e99f1f5129b96bcbddc4d20eb780fcd74))
* **deploy:** fixed vitest dependency mismatch ([5baac7b](https://github.com/Recipe-Web-App/admin-ui-service/commit/5baac7bd14fb3c102ebc4b415fadb06894d802ef))
* **docker:** fixed docker build ([805a97c](https://github.com/Recipe-Web-App/admin-ui-service/commit/805a97cc5c5ddbf8affcd7b5f06a0775db9c729c))
* fixed dependency conflict ([9dd8334](https://github.com/Recipe-Web-App/admin-ui-service/commit/9dd833458072a33f83fc5a3abce7e5688f3683f2))
* fixed dependency conflict ([85be1da](https://github.com/Recipe-Web-App/admin-ui-service/commit/85be1dac2b02b6005acbfd606b2f5215dde04df7))
* updated repo to use correct username (jsamuelsen11) ([3f16d19](https://github.com/Recipe-Web-App/admin-ui-service/commit/3f16d19f9da4cf70ae8523fcffa8d513d9956baa))

## [Unreleased]

### Added

- Initial Angular 21 project setup with SSR support
- PrimeNG v21 integration for UI components
- TailwindCSS v4 for styling with PrimeNG theme integration
- Comprehensive development tooling (ESLint, Prettier, Stylelint)
- Pre-commit hooks with security scanning and code quality checks
- GitHub Actions workflows for CI/CD
- Playwright E2E testing setup
- Vitest unit testing configuration
- Project structure following Angular best practices
- Environment configuration for development and production
- Authentication setup with OAuth2/OIDC support
- Dark mode theming support

### Development

- TypeScript strict mode configuration
- Comprehensive linting and formatting rules
- Security scanning (detect-secrets, gitleaks, trufflehog)
- Automated dependency vulnerability checking
- Code quality gates in CI/CD pipeline

### Documentation

- Technical specification document
- Contributing guidelines
- Security policy
- GitHub issue and PR templates

## [0.1.0] - 2025-09-13

### Initial Release

- Initial project scaffolding
- Repository foundation setup
- Development environment configuration

[Unreleased]: https://github.com/Recipe-Web-App/admin-ui-service/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Recipe-Web-App/admin-ui-service/releases/tag/v0.1.0
