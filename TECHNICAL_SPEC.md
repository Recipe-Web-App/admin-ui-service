# Recipe Web App - Admin UI Service Technical Specification

> **Version**: 1.0  
> **Date**: September 2025  
> **Tech Stack**: Angular 20 + Latest 2025 Technologies

## 1. Project Overview

### Description
Modern Angular 20 server-side rendered admin dashboard for comprehensive recipe web application management with cutting-edge 2025 web technologies.

### Technical Goals
- **High-performance SSR** with Angular Universal + Vite integration
- **Beautiful, responsive admin interface** using PrimeNG + TailwindCSS 4.x
- **Real-time data management** with signal-based reactivity
- **Secure OIDC authentication** with Go backend integration
- **Developer-optimized** with latest tooling and testing infrastructure

### Out of Scope
- Public recipe website (separate service)
- Mobile native applications  
- Real-time messaging/chat features
- Payment processing systems
- External recipe API integrations (future phase)

## 2. Tech Stack - September 2025 Latest

### Core Framework
- **Angular 20.x** - Latest with enhanced signals and hydration
- **Angular Universal** - SSR with streaming and improved hydration
- **Vite 7.x** - Primary build tool (now fully integrated in Angular 20)
- **TypeScript 6.0.x** - Latest language features and performance improvements

### UI & Design System
- **PrimeNG 19.x** - Angular 20 compatible admin components
- **TailwindCSS 4.2.x** - Stable v4 with native CSS and enhanced performance
- **Lucide Angular 3.x** - Modern icon system with Angular 20 support
- **Angular Material 20.x** - Selective use for specific components
- **Angular Animations v20** - Enhanced performance and new animation APIs

### State Management & Reactivity  
- **Angular Signals v20** - Mature signal system with computed optimizations
- **TanStack Query v6.x** - Latest server state with Angular 20 integration
- **RxJS 8.2.x** - Stable with improved tree-shaking and performance
- **Zod 4.1.x** - Major v4 with enhanced TypeScript inference

### Forms & Validation
- **Angular Reactive Forms v20** - Full signal integration
- **Angular Model-driven architecture** - New patterns in v20
- **Zod + Angular Forms** - Type-safe validation integration
- **Custom form components** - Reusable PrimeNG + validation wrappers

### Authentication & Security
- **angular-oauth2-oidc 20.x** - Latest with Angular 20 compatibility
- **PKCE + Refresh Token** - Modern OAuth2 flow
- **Angular Guards v20** - Enhanced functional guards with improved DI
- **JWT handling** - Secure token management and validation

### Testing Stack
- **Vitest 3.x** - Major update with native Angular 20 integration
- **Angular Testing Library 20.x** - Signal-aware testing utilities
- **Playwright 2.2.x** - Latest E2E with improved debugging and trace viewer
- **MSW 3.x** - Enhanced API mocking with better TypeScript support
- **Chromatic** - Visual regression testing for components

### Build & Development Tools
- **Angular CLI 20.x** - Vite-based builds with faster HMR
- **ESLint 10.x** - Latest with Angular 20 rules and improved performance
- **Prettier 4.x** - Major release with enhanced formatting
- **Storybook 9.x** - Component development with Angular 20 support
- **Angular DevTools v20** - Enhanced signal debugging and performance profiling

## 3. Architecture & Design

### Application Structure
```
admin-ui-service/
├── src/
│   ├── app/
│   │   ├── core/                    # Singletons, guards, interceptors
│   │   │   ├── auth/               # Authentication services and guards
│   │   │   ├── interceptors/       # HTTP interceptors
│   │   │   └── services/           # Global services
│   │   ├── shared/                 # Reusable components and utilities
│   │   │   ├── components/         # Common UI components
│   │   │   ├── pipes/             # Custom pipes
│   │   │   ├── directives/        # Custom directives
│   │   │   └── utils/             # Utility functions
│   │   ├── features/               # Feature modules
│   │   │   ├── dashboard/         # Main dashboard
│   │   │   ├── recipes/           # Recipe management
│   │   │   ├── users/             # User management
│   │   │   ├── analytics/         # Analytics and reports
│   │   │   └── settings/          # App settings
│   │   ├── layout/                 # App shell components
│   │   │   ├── header/            # Top navigation
│   │   │   ├── sidebar/           # Side navigation
│   │   │   └── footer/            # Footer component
│   │   └── styles/                 # Global styles and themes
│   │       ├── themes/            # PrimeNG theme customizations
│   │       └── tailwind/          # Tailwind customizations
│   ├── assets/                     # Static assets
│   │   ├── images/                # Images and icons
│   │   └── fonts/                 # Custom fonts
│   └── environments/               # Environment configurations
├── docs/                           # Documentation
├── e2e/                           # Playwright E2E tests
├── tools/                         # Build scripts and schematics
└── storybook/                     # Storybook configuration
```

### Component Architecture Pattern
```typescript
// Modern Angular 20 Signal-Based Component
@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  template: `
    <div class="p-6 bg-white rounded-xl shadow-lg">
      <p-table 
        [value]="recipes()" 
        [loading]="isLoading()"
        [paginator]="true"
        [rows]="20"
        class="w-full">
        
        <ng-template pTemplate="header">
          <tr>
            <th class="text-left font-semibold">Name</th>
            <th class="text-left font-semibold">Category</th>
            <th class="text-left font-semibold">Actions</th>
          </tr>
        </ng-template>
        
        <ng-template pTemplate="body" let-recipe>
          <tr class="hover:bg-slate-50 transition-colors">
            <td>{{ recipe.name }}</td>
            <td>{{ recipe.category }}</td>
            <td>
              <button 
                pButton 
                icon="pi pi-pencil"
                class="p-button-text p-button-sm"
                (click)="editRecipe(recipe)">
              </button>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipeListComponent {
  // Signal-based state management
  private recipeService = inject(RecipeService);
  private router = inject(Router);
  
  // Reactive queries with TanStack Query
  recipesQuery = injectQuery(() => ({
    queryKey: ['recipes', this.filters()],
    queryFn: () => this.recipeService.getRecipes(this.filters()),
    staleTime: 5 * 60 * 1000 // 5 minutes
  }));
  
  // Computed values
  recipes = computed(() => this.recipesQuery.data() ?? []);
  isLoading = computed(() => this.recipesQuery.isLoading());
  error = computed(() => this.recipesQuery.error());
  
  // Local state
  filters = signal<RecipeFilters>({});
  
  // Actions
  editRecipe = (recipe: Recipe) => {
    this.router.navigate(['/recipes', recipe.id, 'edit']);
  };
  
  updateFilters = (newFilters: RecipeFilters) => {
    this.filters.set(newFilters);
  };
}
```

### State Management Architecture
```typescript
// Global App State Service
@Injectable({ providedIn: 'root' })
export class AppStateService {
  private _user = signal<User | null>(null);
  private _theme = signal<'light' | 'dark'>('light');
  private _notifications = signal<Notification[]>([]);
  
  // Read-only computed signals
  user = this._user.asReadonly();
  theme = this._theme.asReadonly();
  notifications = this._notifications.asReadonly();
  isAuthenticated = computed(() => !!this.user());
  isDarkMode = computed(() => this.theme() === 'dark');
  
  // Actions
  setUser = (user: User | null) => this._user.set(user);
  toggleTheme = () => this._theme.update(t => t === 'light' ? 'dark' : 'light');
  addNotification = (notification: Notification) => {
    this._notifications.update(notifications => [...notifications, notification]);
  };
  removeNotification = (id: string) => {
    this._notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  };
}
```

### API Integration Pattern
```typescript
// Modern HTTP Service with Signals
@Injectable({ providedIn: 'root' })
export class RecipeApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/recipes';
  
  getRecipes = (filters?: RecipeFilters) => {
    const params = new HttpParams({ fromObject: filters });
    return this.http.get<Recipe[]>(this.baseUrl, { params });
  };
  
  getRecipe = (id: string) => 
    this.http.get<Recipe>(`${this.baseUrl}/${id}`);
  
  createRecipe = (recipe: CreateRecipeDto) =>
    this.http.post<Recipe>(this.baseUrl, recipe);
  
  updateRecipe = (id: string, recipe: UpdateRecipeDto) =>
    this.http.put<Recipe>(`${this.baseUrl}/${id}`, recipe);
  
  deleteRecipe = (id: string) =>
    this.http.delete<void>(`${this.baseUrl}/${id}`);
}

// TanStack Query Integration
export const useRecipesQuery = (filters = signal<RecipeFilters>({})) => 
  injectQuery(() => ({
    queryKey: ['recipes', filters()],
    queryFn: () => inject(RecipeApiService).getRecipes(filters()),
    staleTime: 5 * 60 * 1000
  }));

export const useRecipeMutation = () => 
  injectMutation(() => ({
    mutationFn: (data: CreateRecipeDto) => 
      inject(RecipeApiService).createRecipe(data),
    onSuccess: () => {
      // Invalidate and refetch recipes
      inject(QueryClient).invalidateQueries({ queryKey: ['recipes'] });
    }
  }));
```

## 4. Styling Integration

### TailwindCSS + PrimeNG Integration
```css
/* Custom CSS Variables for PrimeNG Theme */
:root {
  /* Primary Colors */
  --p-primary-50: theme('colors.blue.50');
  --p-primary-100: theme('colors.blue.100');
  --p-primary-500: theme('colors.blue.500');
  --p-primary-600: theme('colors.blue.600');
  --p-primary-700: theme('colors.blue.700');
  
  /* Surface Colors */
  --p-surface-0: theme('colors.white');
  --p-surface-50: theme('colors.slate.50');
  --p-surface-100: theme('colors.slate.100');
  --p-surface-200: theme('colors.slate.200');
  
  /* Content */
  --p-text-color: theme('colors.slate.700');
  --p-text-muted-color: theme('colors.slate.500');
  
  /* Spacing */
  --p-content-padding: theme('spacing.6');
  --p-component-padding: theme('spacing.4');
  
  /* Borders */
  --p-border-radius: theme('borderRadius.lg');
  --p-border-color: theme('colors.slate.200');
}

/* Dark Mode Overrides */
[data-theme="dark"] {
  --p-surface-0: theme('colors.slate.900');
  --p-surface-50: theme('colors.slate.800');
  --p-text-color: theme('colors.slate.200');
  --p-border-color: theme('colors.slate.700');
}
```

### Component Styling Strategy
```typescript
@Component({
  template: `
    <!-- Layout with Tailwind -->
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      
      <!-- Sidebar with custom styling -->
      <aside class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 shadow-xl border-r border-slate-200 dark:border-slate-700">
        <nav class="p-6 space-y-2">
          <!-- PrimeNG components with Tailwind classes -->
          <p-button 
            label="Dashboard" 
            icon="pi pi-home"
            class="w-full justify-start !bg-blue-50 !text-blue-700 !border-blue-200">
          </p-button>
        </nav>
      </aside>
      
      <!-- Main content area -->
      <main class="ml-64 p-8">
        <div class="max-w-7xl mx-auto space-y-8">
          <!-- Cards with Tailwind + PrimeNG -->
          <p-card class="!bg-white !shadow-lg !rounded-xl !border-0">
            <ng-template pTemplate="header">
              <div class="px-6 py-4 border-b border-slate-200">
                <h2 class="text-xl font-semibold text-slate-800">Recipes</h2>
              </div>
            </ng-template>
            
            <div class="p-6">
              <!-- Content -->
            </div>
          </p-card>
        </div>
      </main>
    </div>
  `
})
export class AppLayoutComponent {
  // Component logic
}
```

## 5. Performance & Optimization

### Bundle Optimization
- **Tree-shaking**: ESBuild + Vite aggressive dead code elimination
- **Code splitting**: Route-based lazy loading for all feature modules
- **Dynamic imports**: On-demand component loading
- **PrimeNG optimization**: Import only required components

### Runtime Performance
- **OnPush change detection**: Automatic with signals in Angular 20
- **Virtual scrolling**: For large data tables and lists
- **Image optimization**: Next-gen formats with Angular's image directive
- **Service workers**: PWA for caching and offline functionality

### Core Web Vitals Targets
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.5s  
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 6. Security Implementation

### Authentication Flow
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private oauthService = inject(OAuthService);
  private router = inject(Router);
  
  private _isAuthenticated = signal(false);
  private _user = signal<User | null>(null);
  
  isAuthenticated = this._isAuthenticated.asReadonly();
  user = this._user.asReadonly();
  
  async login() {
    try {
      await this.oauthService.initCodeFlow();
    } catch (error) {
      console.error('Login failed:', error);
    }
  }
  
  async logout() {
    await this.oauthService.logOut();
    this._isAuthenticated.set(false);
    this._user.set(null);
    this.router.navigate(['/login']);
  }
  
  async refreshToken() {
    try {
      await this.oauthService.refreshToken();
      return true;
    } catch {
      await this.logout();
      return false;
    }
  }
}
```

### Security Headers & CSP
```typescript
// Security configuration
export const securityConfig = {
  csp: {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'"], // Only for development
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", "data:", "https:"],
    'connect-src': ["'self'", "https://api.example.com"]
  },
  headers: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  }
};
```

## 7. Testing Strategy

### Unit Testing with Vitest 3.x
```typescript
// Component testing with Angular Testing Library
import { render, screen } from '@testing-library/angular';
import { RecipeListComponent } from './recipe-list.component';

describe('RecipeListComponent', () => {
  it('should display recipes when loaded', async () => {
    const mockRecipes = [
      { id: '1', name: 'Pasta', category: 'Italian' },
      { id: '2', name: 'Tacos', category: 'Mexican' }
    ];
    
    await render(RecipeListComponent, {
      providers: [
        {
          provide: RecipeService,
          useValue: { getRecipes: () => of(mockRecipes) }
        }
      ]
    });
    
    expect(screen.getByText('Pasta')).toBeInTheDocument();
    expect(screen.getByText('Tacos')).toBeInTheDocument();
  });
});
```

### E2E Testing with Playwright 2.x
```typescript
// E2E test example
import { test, expect } from '@playwright/test';

test.describe('Recipe Management', () => {
  test('should create new recipe', async ({ page }) => {
    await page.goto('/recipes');
    await page.click('[data-testid="add-recipe-btn"]');
    
    await page.fill('[data-testid="recipe-name"]', 'Test Recipe');
    await page.fill('[data-testid="recipe-description"]', 'Test Description');
    await page.click('[data-testid="save-recipe-btn"]');
    
    await expect(page.getByText('Recipe created successfully')).toBeVisible();
    await expect(page.getByText('Test Recipe')).toBeVisible();
  });
});
```

### Testing Coverage Requirements
- **Unit tests**: 80% line coverage, 70% branch coverage
- **Integration tests**: All critical user workflows
- **E2E tests**: Complete user journeys and regression prevention
- **Visual regression**: Component library with Chromatic
- **Performance tests**: Core Web Vitals monitoring

## 8. Development & Build Configuration

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "ng serve --hmr",
    "build": "ng build --configuration=production",
    "build:ssr": "ng build --configuration=production && ng run admin-ui:server",
    "test": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "lint": "eslint src/**/*.{ts,html}",
    "lint:fix": "eslint src/**/*.{ts,html} --fix",
    "format": "prettier --write src/**/*.{ts,html,css,scss}",
    "format:check": "prettier --check src/**/*.{ts,html,css,scss}",
    "storybook": "storybook dev -p 6006",
    "storybook:build": "storybook build",
    "analyze": "ng build --stats-json && npx webpack-bundle-analyzer dist/stats.json",
    "serve:ssr": "node dist/admin-ui/server/main.js"
  }
}
```

### Environment Configuration
```typescript
// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.recipeapp.com',
  authConfig: {
    issuer: 'https://auth.recipeapp.com',
    clientId: 'admin-ui-client',
    scope: 'openid profile email admin',
    responseType: 'code',
    usePkce: true,
    requireHttps: true,
    strictDiscoveryDocumentValidation: false
  },
  features: {
    analytics: true,
    realTimeUpdates: true,
    offlineMode: true,
    darkMode: true
  },
  monitoring: {
    sentryDsn: 'your-sentry-dsn',
    logLevel: 'error'
  }
};

// environment.dev.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authConfig: {
    issuer: 'http://localhost:8080/auth',
    clientId: 'admin-ui-client-dev',
    scope: 'openid profile email admin',
    responseType: 'code',
    usePkce: true,
    requireHttps: false,
    strictDiscoveryDocumentValidation: false
  },
  features: {
    analytics: false,
    realTimeUpdates: true,
    offlineMode: false,
    darkMode: true
  },
  monitoring: {
    sentryDsn: '',
    logLevel: 'debug'
  }
};
```

### Angular Configuration
```json
// angular.json (key sections)
{
  "projects": {
    "admin-ui": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/admin-ui",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css"
            ],
            "budgets": [
              {
                "type": "initial",
                "maximumWarning": "500kb",
                "maximumError": "1mb"
              },
              {
                "type": "anyComponentStyle",
                "maximumWarning": "2kb",
                "maximumError": "4kb"
              }
            ]
          }
        },
        "server": {
          "builder": "@nguniversal/builders:ssr-dev-server",
          "options": {
            "outputPath": "dist/admin-ui/server",
            "main": "server.ts",
            "tsConfig": "tsconfig.server.json"
          }
        }
      }
    }
  }
}
```

### TailwindCSS Configuration
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/primeng/**/*.js"
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
}
```

## 9. Non-Functional Requirements

### Performance Requirements
- **Bundle Size**: Initial bundle < 500KB, lazy routes < 200KB each
- **Load Time**: First Contentful Paint < 1.2s, Time to Interactive < 3.0s
- **Memory Usage**: < 50MB JavaScript heap in steady state
- **API Response**: 95th percentile < 500ms for CRUD operations

### Scalability Requirements
- **Concurrent Users**: Support 1000+ concurrent admin sessions
- **Data Volume**: Handle 100k+ recipes, 10k+ users efficiently
- **Horizontal Scaling**: Stateless SSR servers for load balancing
- **CDN Integration**: Static asset delivery with cache optimization

### Security Requirements
- **Authentication**: OIDC/OAuth2 with PKCE, token rotation
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Input validation, XSS prevention, CSRF protection
- **Infrastructure**: HTTPS enforcement, security headers, CSP

### Reliability & Availability
- **Uptime Target**: 99.9% availability (< 8.76 hours downtime/year)
- **Error Handling**: Graceful degradation, retry mechanisms
- **Monitoring**: Real-time error tracking, performance monitoring
- **Backup Strategy**: Configuration and state backup procedures

### Maintainability Requirements
- **Code Quality**: TypeScript strict mode, ESLint rules, 80% test coverage
- **Documentation**: Comprehensive component library, API documentation
- **Dependency Management**: Automated updates, security scanning
- **Development Velocity**: Feature development cycle < 2 weeks

## 10. Deployment & Operations

### Deployment Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Admin UI
on:
  push:
    branches: [main]
    
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run test:coverage
      - run: npm run test:e2e
      
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build:ssr
      - run: npm run analyze
      
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Deploy SSR build to server
          # Update CDN with static assets
          # Run health checks
```

### Monitoring & Observability
```typescript
// monitoring.service.ts
@Injectable({ providedIn: 'root' })
export class MonitoringService {
  private analytics = inject(GoogleAnalytics);
  private sentry = inject(SentryService);
  
  trackPageView(route: string) {
    this.analytics.pageView(route);
  }
  
  trackUserAction(action: string, category: string) {
    this.analytics.event(action, { category });
  }
  
  reportError(error: Error, context?: any) {
    this.sentry.captureException(error, { extra: context });
  }
  
  measurePerformance(metric: string, value: number) {
    this.analytics.timing(metric, value);
  }
}
```

---

## Next Steps

1. **Environment Setup**: Install Angular CLI 20, configure development environment
2. **Project Initialization**: Create Angular 20 project with Universal SSR
3. **Dependency Installation**: Add PrimeNG, TailwindCSS, and all specified packages
4. **Base Configuration**: Set up TypeScript, ESLint, Prettier, Vitest configurations
5. **Authentication Integration**: Configure OIDC with Go backend
6. **UI Foundation**: Create layout components and design system
7. **Feature Development**: Build dashboard, recipe management, user management
8. **Testing Implementation**: Set up comprehensive testing suite
9. **Performance Optimization**: Bundle analysis and Core Web Vitals monitoring
10. **Production Deployment**: Configure SSR hosting and monitoring

---

**Document Version**: 1.0  
**Last Updated**: September 2025  
**Next Review**: October 2025