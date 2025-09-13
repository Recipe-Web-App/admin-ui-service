import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private _user = signal<User | null>(null);
  private _theme = signal<'light' | 'dark'>('light');
  private _notifications = signal<Notification[]>([]);
  private _isLoading = signal(false);
  private _sidebarCollapsed = signal(false);

  // Read-only computed signals
  user = this._user.asReadonly();
  theme = this._theme.asReadonly();
  notifications = this._notifications.asReadonly();
  isLoading = this._isLoading.asReadonly();
  sidebarCollapsed = this._sidebarCollapsed.asReadonly();

  // Computed values
  isAuthenticated = computed(() => !!this.user());
  isDarkMode = computed(() => this.theme() === 'dark');
  unreadNotifications = computed(() => this.notifications().filter((n) => !n.read));
  unreadCount = computed(() => this.unreadNotifications().length);

  // Actions
  setUser = (user: User | null) => {
    this._user.set(user);
  };

  toggleTheme = () => {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this._theme.set(newTheme);
    this.updateThemeClass(newTheme);
  };

  setTheme = (theme: 'light' | 'dark') => {
    this._theme.set(theme);
    this.updateThemeClass(theme);
  };

  addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false,
    };
    this._notifications.update((notifications) => [...notifications, newNotification]);
  };

  removeNotification = (id: string) => {
    this._notifications.update((notifications) => notifications.filter((n) => n.id !== id));
  };

  markNotificationRead = (id: string) => {
    this._notifications.update((notifications) =>
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  markAllNotificationsRead = () => {
    this._notifications.update((notifications) => notifications.map((n) => ({ ...n, read: true })));
  };

  setLoading = (loading: boolean) => {
    this._isLoading.set(loading);
  };

  toggleSidebar = () => {
    this._sidebarCollapsed.update((collapsed) => !collapsed);
  };

  setSidebarCollapsed = (collapsed: boolean) => {
    this._sidebarCollapsed.set(collapsed);
  };

  private updateThemeClass(theme: 'light' | 'dark') {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.setAttribute('data-theme', 'dark');
        root.classList.add('dark');
      } else {
        root.removeAttribute('data-theme');
        root.classList.remove('dark');
      }
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Initialize theme from localStorage or system preference
  initializeTheme() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored || (systemDark ? 'dark' : 'light');
      this.setTheme(theme);
    }
  }
}
