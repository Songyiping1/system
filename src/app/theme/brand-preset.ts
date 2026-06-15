import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * 品牌主题预设 —— 单一真相源。
 *
 * 把设计 token(见 styles/tokens.css 的 primitive 层)注入 PrimeNG 的 token 层,
 * 让 PrimeNG 全部组件与自定义布局层共用同一套值:
 *   - primary  : 品牌靛蓝(= --p-indigo-*)
 *   - surface  : 冷灰中性(= --p-gray-*)
 *   - 状态色   : Aura 的 severity 实际引用 green/orange/red/sky 四个 primitive
 *                调色板(success→green, warn→orange, danger→red, info→sky),
 *                这里把它们锚定到我们的状态色。⚠️ 名称是 PrimeNG 的(orange/sky),
 *                值与我们 token 的 amber/blue 一致。
 *   - borderRadius : 换成我们的圆角刻度(--radius-*)
 *
 * ⚠️ 色值与 styles/tokens.css 的 primitive 层保持一致,二者同源,改色两处同步。
 */
export const BrandPreset = definePreset(Aura, {
  primitive: {
    // —— 圆角刻度(= --radius-*)——
    borderRadius: {
      none: '0',
      xs: '4px',
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    // —— success(= --success / --p-green-*)——
    green: {
      50: '#e7f8ee',
      100: '#c6efd8',
      200: '#97e3ba',
      300: '#5fd497',
      400: '#2cc07a',
      500: '#15b364',
      600: '#0a9251',
      700: '#097c45',
      800: '#0c6238',
      900: '#0b5130',
      950: '#022c1a',
    },
    // —— warning(= --warning / --p-amber-*)——
    orange: {
      50: '#fef3e2',
      100: '#fde6bf',
      200: '#fbd089',
      300: '#f9b54e',
      400: '#f7a521',
      500: '#f59e0b',
      600: '#d97e06',
      700: '#b46108',
      800: '#924d0d',
      900: '#78400f',
      950: '#451f04',
    },
    // —— danger(= --danger / --p-red-*)——
    red: {
      50: '#fdeaea',
      100: '#fbd5d5',
      200: '#f7b0b0',
      300: '#f28080',
      400: '#ef5a5a',
      500: '#ef4343',
      600: '#d92d2d',
      700: '#b71f1f',
      800: '#971c1c',
      900: '#7e1d1d',
      950: '#440a0a',
    },
    // —— info(= --info / --p-blue-*)——
    sky: {
      50: '#e8f1fe',
      100: '#d3e4fd',
      200: '#aecbfb',
      300: '#7dabf8',
      400: '#4d8bf5',
      500: '#3b82f6',
      600: '#2570eb',
      700: '#1d5fd1',
      800: '#1e4fa9',
      900: '#1e4585',
      950: '#172a51',
    },
  },
  semantic: {
    // —— 品牌主色:靛蓝(= --p-indigo-*)——
    primary: {
      50: '#eef0ff',
      100: '#e0e3ff',
      200: '#c4caff',
      300: '#a0a8ff',
      400: '#7b82fb',
      500: '#5b61f2',
      600: '#4a4ee3',
      700: '#3b3fc4',
      800: '#31349e',
      900: '#2c2f7c',
      950: '#23265e',
    },
    // —— 表面/中性灰:冷灰(= --p-gray-*)——
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f6f8fa',
          100: '#eef1f4',
          200: '#e1e6ec',
          300: '#cbd2db',
          400: '#9aa3b2',
          500: '#6c7585',
          600: '#4d5563',
          700: '#363d49',
          800: '#222831',
          900: '#12161d',
          950: '#0b0e13',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '#f6f8fa',
          100: '#eef1f4',
          200: '#e1e6ec',
          300: '#cbd2db',
          400: '#9aa3b2',
          500: '#6c7585',
          600: '#4d5563',
          700: '#363d49',
          800: '#222831',
          900: '#12161d',
          950: '#0b0e13',
        },
      },
    },
  },
});
