import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AuthStore } from '../../core/auth/auth.store';
import {
  RevealDirective,
  RevealStaggerDirective,
} from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-session',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, TagModule, RevealDirective, RevealStaggerDirective],
  styleUrl: './session.scss',
  template: `
    <main class="session" appReveal>
      <header class="session__head">
        <div>
          <span class="eyebrow">平台管理控制台</span>
          <h1>{{ store.displayName() || '平台管理员' }}</h1>
          <p>{{ accountLine() }}</p>
        </div>

        <div class="session__actions">
          <p-button
            label="退出登录"
            icon="pi pi-sign-out"
            severity="danger"
            [outlined]="true"
            (onClick)="logout()"
          />
        </div>
      </header>

      <section class="session-grid" appRevealStagger [appRevealStaggerGap]="0.05">
        <article class="stat">
          <span>账号体系</span>
          <strong>平台管理员</strong>
          <p-tag value="独立体系" severity="info" />
        </article>

        <article class="stat">
          <span>登录账号</span>
          <strong>{{ store.user()?.username || '-' }}</strong>
          <small>{{ store.user()?.mobile || '未绑定手机号' }}</small>
        </article>

        <article class="stat">
          <span>Token 有效期</span>
          <strong>{{ expiresText() }}</strong>
          <small>后端签发的 access token</small>
        </article>
      </section>

      <section class="session-panel" appReveal [appRevealDelay]="0.08">
        <div class="session-panel__title">
          <span class="eyebrow">会话信息</span>
          <h2>当前平台管理员身份</h2>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <span>管理员 ID</span>
            <strong>{{ store.user()?.id || '-' }}</strong>
          </div>
          <div class="detail-item">
            <span>用户名</span>
            <strong>{{ store.user()?.username || '-' }}</strong>
          </div>
          <div class="detail-item">
            <span>手机号</span>
            <strong>{{ store.user()?.mobile || '-' }}</strong>
          </div>
          <div class="detail-item">
            <span>显示名称</span>
            <strong>{{ store.user()?.displayName || '-' }}</strong>
          </div>
        </div>
      </section>
    </main>
  `,
})
export class SessionPage {
  protected readonly store = inject(AuthStore);
  protected readonly accountLine = computed(() => {
    const user = this.store.user();
    if (!user) return '未读取到平台管理员身份';
    return user.mobile ? `${user.username} · ${user.mobile}` : user.username;
  });
  protected readonly expiresText = computed(() =>
    this.formatExpires(this.store.user()?.accessTokenExpiresIn),
  );

  private readonly router = inject(Router);

  logout(): void {
    this.store.signOut();
    this.router.navigateByUrl('/login');
  }

  private formatExpires(seconds?: number): string {
    if (!seconds || seconds <= 0) return '-';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h`;
  }
}
