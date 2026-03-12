import { Injectable, signal } from '@angular/core';

export interface AccountTheme {
  navBg: string;
  navActive: string;
  logoBg: string;
}

export const THEME_PRESETS: Record<string, AccountTheme> = {
  blue: {
    navBg: '#053b64',
    navActive: '#165789',
    logoBg: '#2a7a4f',
  },
  green: {
    navBg: '#0a3d2a',
    navActive: '#14654a',
    logoBg: '#2a7a4f',
  },
  dark: {
    navBg: '#1a1a2e',
    navActive: '#2d2d44',
    logoBg: '#4857e2',
  },
  purple: {
    navBg: '#2e1a4a',
    navActive: '#44296e',
    logoBg: '#7c3aed',
  },
};

const CSS_VAR_MAP: Record<keyof AccountTheme, string> = {
  navBg: '--color-nav-bg',
  navActive: '--color-nav-active',
  logoBg: '--color-logo-bg',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly currentTheme = signal<AccountTheme>(THEME_PRESETS['blue']);

  applyTheme(themeOrKey: AccountTheme | string): void {
    const theme =
      typeof themeOrKey === 'string'
        ? THEME_PRESETS[themeOrKey] ?? THEME_PRESETS['blue']
        : themeOrKey;

    this.currentTheme.set(theme);

    const root = document.documentElement.style;
    for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
      root.setProperty(cssVar, theme[key as keyof AccountTheme]);
    }
  }
}
