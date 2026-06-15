import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { TokenStorage } from './token.storage';
import { AuthService } from '../../features/auth/auth.service';
import {
  AuthEnvironmentResult,
  CompanyWorkspaceResult,
  PermissionNode,
} from '../../features/auth/auth.model';

/**
 * 当前登录用户。字段对齐 pass-authx 的用户 VO。
 */
export interface AuthUser {
  id: string;
  username: string;
  nickname?: string;
  avatar?: string;
  /** 当前所属公司/组织 id */
  orgId?: string;
}

interface AuthState {
  user: AuthUser | null;
  /** 当前会话公司 id */
  activeCompanyId: string | null;
  /** 可进入的公司列表 */
  companies: CompanyWorkspaceResult[];
  /** 当前公司可见菜单树 */
  menus: PermissionNode[];
  /** 是否已完成初始化(从 storage 恢复登录态) */
  initialized: boolean;
  /** 是否已水合(拉过 /authx/auth 环境) */
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  activeCompanyId: null,
  companies: [],
  menus: [],
  initialized: false,
  hydrated: false,
};

/** AuthEnvironmentResult.user(CurrentUserResult)→ 内存 AuthUser */
function toAuthUser(env: AuthEnvironmentResult): AuthUser {
  return {
    id: env.user.id,
    username: env.user.username,
    nickname: env.user.username,
    avatar: env.user.avatarUrl,
    orgId: env.activeOrgId ?? env.user.defaultOrgId,
  };
}

/**
 * AuthStore —— 全局登录态 + 登录环境(公司/菜单)。
 *
 * 用 NgRx SignalStore:基于 signal,zoneless 友好,无 boilerplate。
 * token 真身在 TokenStorage(localStorage),这里只放内存态 + 派生信号。
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    /** 是否已登录:有用户即视为登录(token 由 storage 保证) */
    isLoggedIn: computed(() => store.user() !== null),
    /** 展示名:昵称优先,回落用户名 */
    displayName: computed(
      () => store.user()?.nickname || store.user()?.username || '',
    ),
    /** 当前公司:优先 current 标记,回落 activeCompanyId 匹配 */
    currentCompany: computed(() => {
      const companies = store.companies();
      return (
        companies.find((c) => c.current) ??
        companies.find((c) => c.id === store.activeCompanyId()) ??
        null
      );
    }),
  })),

  withMethods(
    (
      store,
      tokenStorage = inject(TokenStorage),
      auth = inject(AuthService),
    ) => ({
      /** 登录成功:存 token + 设置用户(登录环境随后由 hydrate 补全) */
      signIn(accessToken: string, user: AuthUser, refreshToken?: string): void {
        tokenStorage.setTokens(accessToken, refreshToken);
        patchState(store, { user });
      },

      /** 更新当前用户信息(如改了昵称/头像) */
      setUser(user: AuthUser): void {
        patchState(store, { user });
      },

      /** 写入登录环境(公司、菜单、当前用户) */
      setEnvironment(env: AuthEnvironmentResult): void {
        patchState(store, {
          user: toAuthUser(env),
          activeCompanyId: env.activeCompanyId ?? null,
          companies: env.companies ?? [],
          menus: env.menus ?? [],
          hydrated: true,
          initialized: true,
        });
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

      /**
       * 水合 —— 拉 /authx/auth 填充全局环境。
       * 返回是否成功;失败时由调用方(guard)决定跳转。
       * 401 已由 auth.interceptor 统一清 token + 跳登录。
       */
      hydrate(): Observable<boolean> {
        return auth.authEnvironment().pipe(
          tap((env) => {
            patchState(store, {
              user: toAuthUser(env),
              activeCompanyId: env.activeCompanyId ?? null,
              companies: env.companies ?? [],
              menus: env.menus ?? [],
              hydrated: true,
              initialized: true,
            });
          }),
          map(() => true),
          catchError(() => {
            patchState(store, { initialized: true });
            return of(false);
          }),
        );
      },
    }),
  ),
);
