# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 20 admin dashboard for recipe management with server-side rendering (SSR) support. Built with PrimeNG v20, TailwindCSS v4, and modern signal-based state management.

## Development Commands

### Core Development

- `bun run dev` - Start development server with HMR
- `bun run start` - Start development server (no HMR)
- `bun run build` - Production build with SSR
- `bun run serve:ssr:admin-ui-service` - Serve SSR build

### Testing

- `bun run test` - Run unit tests with Vitest
- `bun run test:watch` - Run unit tests in watch mode
- `bun run test:e2e` - Run E2E tests with Playwright
- `bun run test:coverage` - Run tests with coverage report
- `bun run test:ui` - Interactive test UI

### Code Quality

- `bun run lint` - Run ESLint
- `bun run lint:fix` - Fix ESLint issues
- `bun run lint:check` - Check linting without fixing
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check formatting without fixing
- `bun run build:check` - Type check without build (outputs to /tmp)

### Analysis

- `bun run analyze` - Analyze bundle size

## Architecture

### Directory Structure

```
src/app/
├── core/                    # Singletons, guards, interceptors
│   ├── auth/               # Authentication services and guards
│   ├── interceptors/       # HTTP interceptors
│   └── services/           # Global services (e.g., app-state.service.ts)
├── shared/                 # Reusable components and utilities
│   ├── components/         # Common UI components
│   ├── pipes/             # Custom pipes
│   ├── directives/        # Custom directives
│   └── utils/             # Utility functions
├── features/               # Feature modules (lazy-loaded)
│   ├── dashboard/         # Main dashboard
│   ├── recipes/           # Recipe management
│   ├── users/             # User management
│   ├── analytics/         # Analytics and reports
│   └── settings/          # App settings
├── layout/                 # App shell components
│   ├── header/            # Top navigation
│   ├── sidebar/           # Side navigation
│   └── footer/            # Footer component
├── components/             # Presentation components
└── styles/                 # Global styles and themes
```

### State Management Pattern

This application uses **Angular Signals** for state management, NOT traditional RxJS observables for state. The pattern is demonstrated in `src/app/core/services/app-state.service.ts`:

1. **Private signals** with `signal()` for internal state
2. **Public readonly signals** with `.asReadonly()` for external access
3. **Computed signals** with `computed()` for derived values
4. **Action methods** to update state

Example pattern:

```typescript
@Injectable({ providedIn: 'root' })
export class AppStateService {
  private _user = signal<User | null>(null);

  // Read-only access
  user = this._user.asReadonly();

  // Computed values
  isAuthenticated = computed(() => !!this.user());

  // Actions
  setUser = (user: User | null) => this._user.set(user);
}
```

### Component Architecture

- **Standalone components** - All components should be standalone
- **OnPush change detection** - Use `ChangeDetectionStrategy.OnPush`
- **Signal-based reactivity** - Prefer signals over observables for component state
- **Dependency injection** - Use `inject()` function instead of constructor injection
- **TanStack Query** - Use for server state management with signals integration

### API Integration

- Use **TanStack Query** (`@tanstack/angular-query-experimental`) for server state
- HTTP services should return Observables
- Wrap API calls with `injectQuery()` or `injectMutation()` hooks

## Technology Stack

### Core

- **Angular 20** with SSR via Angular Universal
- **TypeScript** with strict mode enabled
- **Vite** build tool (integrated in Angular 20)

### UI & Styling

- **PrimeNG 20** for UI components
- **TailwindCSS 4** for utility-first styling
- **Lucide Angular** for icons
- Dark/Light mode theming support

### State & Data

- **Angular Signals** for local/global state
- **TanStack Query** for server state
- **RxJS** for async operations (streams, not state)
- **Zod** for validation

### Testing

- **Vitest** for unit tests
- **Playwright** for E2E tests

## Code Conventions

### TypeScript

- **Strict mode** enabled - all TypeScript strict options are on
- Use `inject()` for dependency injection
- Prefer `const` arrow functions for class methods
- Component selectors use `app-` prefix with kebab-case
- Directive selectors use `app` prefix with camelCase

### Styling

- **Tailwind utility classes** for most styling
- **PrimeNG CSS variables** for theme customization
- Dark mode uses `data-theme="dark"` attribute
- Component styles should be minimal, prefer Tailwind

### Git Commits

- Use **Conventional Commits** format: `type(scope): description`
- Valid types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Commits checked by commitlint

## Important Configuration Details

### Build Configuration

- **Bundle size limits**: Initial bundle < 500KB (warning), < 1MB (error)
- **Component styles**: < 4KB (warning), < 8KB (error)
- **SSR enabled** with hydration and event replay
- Build output configured for server-side rendering

### TypeScript Configuration

- All strict options enabled in `tsconfig.json`
- `experimentalDecorators: true` for Angular
- `strictTemplates: true` in Angular compiler options
- Target: ES2022

### Testing Notes

- Vitest is the primary unit test runner
- E2E tests use Playwright
- Test configuration in vitest.config.ts or package.json

### SSR Considerations

- Always check for browser environment: `typeof window !== 'undefined'`
- Use platform checks: `typeof document !== 'undefined'`
- Theme initialization checks for localStorage availability
- Server entry point: `src/server.ts`

## Pre-commit Hooks

This project uses pre-commit hooks (`.pre-commit-config.yaml`):

- Security scanning (detect-secrets, gitleaks, trufflehog)
- Code quality checks (ESLint, Prettier, Stylelint)
- Markdown linting
- License checking
- Install with: `pre-commit install`

## Runtime Requirements

- Node.js >= 20.0.0
- Bun >= 1.1.0
