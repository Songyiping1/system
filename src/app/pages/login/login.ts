import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthStore } from '../../core/auth/auth.store';
import { TokenStorage } from '../../core/auth/token.storage';
import { ApiError } from '../../core/http/api-response.model';
import {
  RevealDirective,
  RevealStaggerDirective,
} from '../../shared/directives/reveal.directive';
import { AuthService } from '../../features/auth/auth.service';

type LoginPhase = 'idle' | 'validating' | 'authenticating' | 'hydrating' | 'complete';

interface FieldErrors {
  mobile?: string;
  password?: string;
}

@Component({
  selector: 'app-login',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    RevealDirective,
    RevealStaggerDirective,
  ],
  styleUrl: './login.scss',
  template: `
    <main class="login-shell">
      <section class="login-hero" appReveal>
        <header class="brand">
          <span class="brand__mark">PA</span>
          <div class="brand__copy">
            <strong>PassAuth Console</strong>
            <span>统一登录入口</span>
          </div>
        </header>

        <figure class="login-visual" aria-hidden="true">
          <div class="console-panel">
            <div class="console-panel__bar">
              <span></span>
              <span></span>
              <span></span>
              <strong>PassAuth 控制台</strong>
            </div>

            <div class="console-grid">
              <div class="console-auth">
                <span class="console-auth__shield">
                  <i class="pi pi-shield"></i>
                </span>
                <div class="console-auth__copy">
                  <strong>身份验证</strong>
                  <span>账号、设备、会话</span>
                </div>
              </div>

              <div class="console-status">
                <div>
                  <span>公司</span>
                  <strong>已匹配</strong>
                </div>
                <div>
                  <span>角色</span>
                  <strong>已确认</strong>
                </div>
                <div>
                  <span>菜单</span>
                  <strong>可访问</strong>
                </div>
              </div>

              <div class="console-matrix">
                <span class="matrix-cell matrix-cell--active"></span>
                <span></span>
                <span class="matrix-cell matrix-cell--active"></span>
                <span></span>
                <span class="matrix-cell matrix-cell--active"></span>
                <span class="matrix-cell matrix-cell--active"></span>
                <span></span>
                <span class="matrix-cell matrix-cell--active"></span>
                <span></span>
                <span></span>
                <span class="matrix-cell matrix-cell--active"></span>
                <span></span>
              </div>
            </div>

            <div class="console-flow">
              <span>身份</span>
              <i class="pi pi-arrow-right"></i>
              <span>公司</span>
              <i class="pi pi-arrow-right"></i>
              <span>角色</span>
              <i class="pi pi-arrow-right"></i>
              <span>菜单</span>
            </div>
          </div>
        </figure>
      </section>

      <section class="login-workbench" appReveal [appRevealDelay]="0.08">
        <header class="workbench-head">
          <div>
            <span class="eyebrow">账号登录</span>
            <h2>进入 PassAuth Console</h2>
          </div>
          <span class="phase-badge" [class.phase-badge--active]="submitting()">
            {{ phaseLabel() }}
          </span>
        </header>

        @if (error()) {
          <div class="error-block" role="alert" appReveal>
            <span class="error-block__icon">!</span>
            <div>
              <strong>{{ errorTitle() }}</strong>
              <p>{{ error() }}</p>
            </div>
          </div>
        }

        <form class="login-form" (ngSubmit)="submit()" appRevealStagger>
          <label class="field" [class.field--invalid]="fieldErrors().mobile">
            <span class="field__label">手机号</span>
            <input
              pInputText
              name="mobile"
              inputmode="numeric"
              autocomplete="username"
              placeholder="请输入手机号"
              [disabled]="submitting()"
              [class.is-invalid]="fieldErrors().mobile"
              [ngModel]="mobile()"
              (ngModelChange)="setMobile($event)"
            />
            @if (fieldErrors().mobile) {
              <small class="field__error">{{ fieldErrors().mobile }}</small>
            }
          </label>

          <label class="field" [class.field--invalid]="fieldErrors().password">
            <span class="field__label">密码</span>
            <p-password
              name="password"
              autocomplete="current-password"
              placeholder="请输入密码"
              [feedback]="false"
              [toggleMask]="true"
              [disabled]="submitting()"
              [ngModel]="password()"
              (ngModelChange)="setPassword($event)"
              styleClass="login-password"
              inputStyleClass="login-password__input"
            />
            @if (fieldErrors().password) {
              <small class="field__error">{{ fieldErrors().password }}</small>
            }
          </label>

          <div class="trust-row" aria-label="登录说明">
            <span><i class="pi pi-shield"></i>安全连接</span>
            <span><i class="pi pi-building"></i>进入工作区</span>
          </div>

          <p-button
            type="submit"
            [label]="submitLabel()"
            icon="pi pi-arrow-right"
            iconPos="right"
            [loading]="submitting()"
            [disabled]="!canSubmit()"
            styleClass="login-submit"
          />
        </form>
      </section>
    </main>
  `,
})
export class LoginPage implements OnInit {
  protected readonly mobile = signal('');
  protected readonly password = signal('');
  protected readonly submitting = signal(false);
  protected readonly error = signal('');
  protected readonly errorTitle = signal('登录失败');
  protected readonly phase = signal<LoginPhase>('idle');
  protected readonly fieldErrors = signal<FieldErrors>({});

  protected readonly canSubmit = computed(
    () =>
      !this.submitting() &&
      this.mobile().trim().length > 0 &&
      this.password().length > 0,
  );

  protected readonly phaseLabel = computed(() => {
    switch (this.phase()) {
      case 'validating':
        return '正在检查';
      case 'authenticating':
        return '正在验证';
      case 'hydrating':
        return '正在准备';
      case 'complete':
        return '登录完成';
      default:
        return '等待登录';
    }
  });

  protected readonly submitLabel = computed(() => {
    switch (this.phase()) {
      case 'authenticating':
        return '验证中';
      case 'hydrating':
        return '准备中';
      case 'complete':
        return '进入中';
      default:
        return '进入系统';
    }
  });

  private readonly auth = inject(AuthService);
  private readonly store = inject(AuthStore);
  private readonly tokenStorage = inject(TokenStorage);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    if (!this.tokenStorage.accessToken) return;

    this.phase.set('hydrating');
    this.store.hydrate().subscribe({
      next: (ok) => {
        if (ok) {
          this.phase.set('complete');
          this.router.navigateByUrl(this.returnUrl());
          return;
        }
        this.phase.set('idle');
      },
      error: () => this.phase.set('idle'),
    });
  }

  setMobile(value: string): void {
    this.mobile.set(value);
    this.fieldErrors.update((errors) => ({ ...errors, mobile: undefined }));
    this.error.set('');
  }

  setPassword(value: string): void {
    this.password.set(value);
    this.fieldErrors.update((errors) => ({ ...errors, password: undefined }));
    this.error.set('');
  }

  submit(): void {
    const mobile = this.mobile().trim();
    const password = this.password();

    this.phase.set('validating');
    if (!this.validate(mobile, password)) {
      this.phase.set('idle');
      return;
    }

    this.error.set('');
    this.submitting.set(true);
    this.phase.set('authenticating');

    this.auth
      .passwordLogin(mobile, password)
      .pipe(
        tap((result) => {
          if (result.flowStage && result.flowStage !== 'authenticated') {
            throw new Error('当前账号需要完成额外验证，请按提示继续');
          }
          this.tokenStorage.setTokens(result.accessToken, result.refreshToken);
          this.phase.set('hydrating');
        }),
        switchMap(() => this.store.hydrate()),
        finalize(() => this.submitting.set(false)),
      )
      .subscribe({
        next: (ok) => {
          if (!ok) {
            this.phase.set('idle');
            this.showError('进入工作区失败', '登录成功，但进入工作区失败，请稍后重试');
            return;
          }
          this.phase.set('complete');
          window.setTimeout(() => this.router.navigateByUrl(this.returnUrl()), 220);
        },
        error: (err: unknown) => {
          this.phase.set('idle');
          this.showError('登录失败', this.messageOf(err));
        },
      });
  }

  private returnUrl(): string {
    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    return url && url !== '/login' ? url : '/session';
  }

  private validate(mobile: string, password: string): boolean {
    const errors: FieldErrors = {};
    if (!mobile) {
      errors.mobile = '请输入手机号';
    } else if (!/^\d{6,20}$/.test(mobile)) {
      errors.mobile = '手机号只能包含 6-20 位数字';
    }

    if (!password) {
      errors.password = '请输入密码';
    }

    this.fieldErrors.set(errors);
    const valid = Object.keys(errors).length === 0;
    if (!valid) this.showError('信息不完整', '请先修正表单中的标红字段');
    return valid;
  }

  private messageOf(err: unknown): string {
    if (err instanceof ApiError) return err.message || '登录失败';
    if (err instanceof Error) return err.message || '登录失败';
    return '登录失败';
  }

  private showError(title: string, message: string): void {
    this.errorTitle.set(title);
    this.error.set(message);
  }
}
