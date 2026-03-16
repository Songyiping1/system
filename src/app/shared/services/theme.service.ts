import { Injectable, signal } from '@angular/core';

export interface AccountTheme {
  navBg: string;
  navActive: string;
  logoBg: string;
}

export const THEME_PRESETS: Record<string, AccountTheme> = {
  blue: {
    navBg: '#053B64',
    navActive: '#165789',
    logoBg: '#053B64',
  },
  dark: {
    navBg: '#2c2a3a',
    navActive: '#525068',
    logoBg: '#2c2a3a',
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
