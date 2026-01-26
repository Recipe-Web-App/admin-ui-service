# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Angular 21 admin dashboard for recipe management with server-side rendering (SSR). Built with PrimeNG v21, TailwindCSS v4, and signal-based state management. Currently in early development with scaffolded directory structure.

## Development Commands

```bash
# Development
bun run dev                    # Start dev server with HMR (localhost:4200)
bun run build                  # Production build with SSR
bun run serve:ssr:admin-ui-service  # Serve SSR build

# Testing
bun run test                   # Run unit tests with Vitest
bun run test:watch             # Watch mode
bunx vitest run src/app/path/to/file.spec.ts  # Single test file
bun run test:e2e               # E2E tests with Playwright
bun run test:coverage          # Coverage report

# Code Quality
bun run lint                   # ESLint
bun run lint:fix               # Fix ESLint issues
bun run format                 # Prettier format
bun run build:check            # Type check only (outputs to /tmp)
```

## Architecture

### Directory Structure

```
src/app/
├── core/                    # Singletons, guards, interceptors
│   └── services/            # Global services (app-state.service.ts)
├── shared/                  # Reusable components, pipes, directives, utils
├── features/                # Feature modules (lazy-loaded)
├── layout/                  # App shell (header, sidebar, footer)
├── components/              # Presentation components
└── styles/                  # Global styles and themes
```

### State Management Pattern

Use **Angular Signals** for state management (NOT RxJS observables for state). Reference implementation: `src/app/core/services/app-state.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class AppStateService {
  // Private writable signal
  private _user = signal<User | null>(null);

  // Public readonly access
  user = this._user.asReadonly();

  // Computed derived values
  isAuthenticated = computed(() => !!this.user());

  // Action methods to update state
  setUser = (user: User | null) => this._user.set(user);
}
```

### Component Conventions

- **Standalone components** - all components must be standalone
- **OnPush change detection** - use `ChangeDetectionStrategy.OnPush`
- **inject() function** - use instead of constructor injection
- **Signals for state** - prefer signals over observables for component state
- **TanStack Query** - use `injectQuery()` / `injectMutation()` for server state

### Selector Prefixes

- Components: `app-` prefix, kebab-case (e.g., `app-recipe-list`)
- Directives: `app` prefix, camelCase (e.g., `appHighlight`)

## Technology Stack

| Category      | Technology          |
| ------------- | ------------------- |
| Framework     | Angular 21 with SSR |
| UI Components | PrimeNG 21          |
| Styling       | TailwindCSS 4       |
| Icons         | Lucide Angular      |
| Server State  | TanStack Query      |
| Local State   | Angular Signals     |
| Validation    | Zod                 |
| Unit Tests    | Vitest              |
| E2E Tests     | Playwright          |

## SSR Considerations

Always guard browser-only APIs:

```typescript
if (typeof window !== 'undefined') {
  // Browser-only code (localStorage, window, etc.)
}

if (typeof document !== 'undefined') {
  // DOM manipulation
}
```

## Configuration Notes

- **TypeScript**: Strict mode enabled, target ES2022
- **Bundle limits**: Initial < 500KB warning, < 1MB error
- **Component styles**: < 4KB warning, < 8KB error
- **Dark mode**: Uses `data-theme="dark"` attribute on document root

## Git Commits

Use Conventional Commits format: `type(scope): description`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
