import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TokenStorage } from './token.storage';
import {
  PlatformAdminLoginResult,
  PlatformAdminProfile,
} from '../../features/auth/auth.model';

/**
 * 平台管理员登录态。
 */
export type AuthUser = PlatformAdminProfile;

interface AuthState {
  user: AuthUser | null;
  /** 是否已完成初始化(从 storage 恢复登录态) */
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  initialized: false,
};

/**
 * AuthStore —— 平台管理员登录态。
 *
 * 用 NgRx SignalStore:基于 signal,zoneless 友好,无 boilerplate。
 * token 与平台管理员 profile 真身在 TokenStorage(localStorage)。
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    /** 是否已登录:有用户即视为登录(token 由 storage 保证) */
    isLoggedIn: computed(() => store.user() !== null),
    /** 展示名:昵称优先,回落用户名 */
    displayName: computed(
      () => store.user()?.displayName || store.user()?.username || '',
    ),
  })),

  withMethods(
    (
      store,
      tokenStorage = inject(TokenStorage),
    ) => ({
      /** 登录成功:存平台 token + 平台管理员资料。 */
      signIn(result: PlatformAdminLoginResult): void {
        tokenStorage.setPlatformSession(result);
        patchState(store, {
          user: tokenStorage.profile,
          initialized: true,
        });
      },

      /** 从 localStorage 恢复平台管理员资料。 */
      restoreFromStorage(): boolean {
        const profile = tokenStorage.profile;
        const hasSession = Boolean(tokenStorage.accessToken && profile);
        patchState(store, {
          user: hasSession ? profile : null,
          initialized: true,
        });
        if (!hasSession) tokenStorage.clear();
        return hasSession;
      },

      /** 登出:清 token + 清全部内存态 */
      signOut(): void {
        tokenStorage.clear();
        patchState(store, initialState);
      },

      /** 标记初始化完成 */
      markInitialized(): void {
        patchState(store, { initialized: true });
      },
    }),
  ),
);
