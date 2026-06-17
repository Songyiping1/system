import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmService } from '../../core/feedback/confirm.service';
import { ToastService } from '../../core/feedback/toast.service';
import { SystemService } from '../../features/system/system.service';
import {
  EMPTY_USER_LIST_SUMMARY,
  SystemUser,
  SystemUserDetail,
  USER_STATE_OPTIONS,
} from '../../features/system/system.model';
import { PageResult, emptyPage } from '../../shared/models/page-result';

@Component({
  selector: 'app-users-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    DrawerModule,
    InputTextModule,
    SelectModule,
    SkeletonModule,
    TagModule,
    TooltipModule,
  ],
  styleUrl: './users.scss',
  template: `
    <section class="page">
      <section class="data-panel">
        <div class="data-panel__tools">
          <label class="search">
            <i class="pi pi-search"></i>
            <input
              pInputText
              placeholder="用户名 / 手机号 / 真实姓名"
              [ngModel]="keyword()"
              (ngModelChange)="keyword.set($event)"
              (keyup.enter)="search()"
            />
          </label>
          <p-select
            [options]="stateOptions"
            optionLabel="label"
            optionValue="value"
            [ngModel]="state()"
            (ngModelChange)="setState($event)"
            styleClass="state-select"
          />
          <p-button label="查询" icon="pi pi-filter" (onClick)="search()" />
          <span class="data-panel__tools-spacer"></span>
          <p-button icon="pi pi-refresh" label="刷新" [text]="true" (onClick)="load()" />
        </div>

        <div class="summary-strip" [class.is-loading]="summaryLoading()">
          <div class="summary-strip__group" aria-label="用户状态统计">
            @for (item of stateSummaryItems(); track item.value) {
              <button
                class="summary-chip"
                type="button"
                [class.is-active]="state() === item.value"
                [attr.aria-pressed]="state() === item.value"
                (click)="selectSummaryState(item.value)"
              >
                <i [class]="item.icon"></i>
                <span>{{ item.label }}</span>
                <strong>{{ item.count }}</strong>
              </button>
            }
          </div>
          <div class="summary-strip__group summary-strip__group--company" aria-label="公司归属统计">
            @for (item of companySummaryItems(); track item.label) {
              <span class="summary-chip summary-chip--readonly">
                <i [class]="item.icon"></i>
                <span>{{ item.label }}</span>
                <strong>{{ item.count }}</strong>
              </span>
            }
          </div>
          @if (summaryError()) {
            <span class="summary-strip__error">{{ summaryError() }}</span>
          }
        </div>

        <div class="data-panel__head">
          <div>
            <strong>用户列表</strong>
            <span>共 {{ result().total }} 个账号</span>
          </div>
          <span class="page-meta">第 {{ result().page }} / {{ totalPages() }} 页</span>
        </div>

        @if (loading()) {
          <div class="skeleton-list">
            @for (row of skeletonRows; track row) {
              <p-skeleton height="42px" borderRadius="6px" />
            }
          </div>
        } @else if (error()) {
          <div class="state-block state-block--error">
            <i class="pi pi-exclamation-triangle"></i>
            <strong>用户列表加载失败</strong>
            <p>{{ error() }}</p>
            <p-button label="重试" icon="pi pi-refresh" [outlined]="true" (onClick)="load()" />
          </div>
        } @else if (result().items.length === 0) {
          <div class="state-block">
            <i class="pi pi-users"></i>
            <strong>没有匹配用户</strong>
            <p>调整关键词或状态筛选后重试。</p>
          </div>
        } @else {
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>账号</th>
                  <th>手机号</th>
                  <th>类型</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th class="actions-col">操作</th>
                </tr>
              </thead>
              <tbody>
                @for (user of result().items; track user.id) {
                  <tr>
                    <td>
                      <button class="user-cell" type="button" (click)="openDetail(user)">
                        <span
                          class="user-state-dot"
                          [class.is-active]="user.state === 'active'"
                          [class.is-disabled]="user.state === 'disabled'"
                          [class.is-archived]="user.state === 'archived'"
                          [class.is-deleted]="user.state === 'deleted'"
                          aria-hidden="true"
                        ></span>
                        <span class="user-cell__text">
                          <strong>{{ user.username || user.realName || '-' }}</strong>
                          <small>{{ user.id }}</small>
                        </span>
                      </button>
                    </td>
                    <td>{{ user.mobile || '-' }}</td>
                    <td>{{ user.accountType || '-' }}</td>
                    <td>
                      <p-tag [value]="stateLabel(user.state)" [severity]="stateSeverity(user.state)" />
                    </td>
                    <td>{{ formatTime(user.createdAt) }}</td>
                    <td class="row-actions">
                      <span class="row-actions__inner">
                        <p-button
                          icon="pi pi-eye"
                          [text]="true"
                          pTooltip="查看详情"
                          ariaLabel="查看详情"
                          (onClick)="openDetail(user)"
                        />
                        <p-button
                          icon="pi pi-ban"
                          [text]="true"
                          severity="danger"
                          pTooltip="禁用账号"
                          ariaLabel="禁用账号"
                          [disabled]="user.state === 'disabled'"
                          (onClick)="changeState(user, 'disabled')"
                        />
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }

        <div class="pager">
          <p-button
            label="上一页"
            icon="pi pi-chevron-left"
            [outlined]="true"
            [disabled]="page() <= 1 || loading()"
            (onClick)="gotoPage(page() - 1)"
          />
          <span>{{ page() }} / {{ totalPages() }}</span>
          <p-button
            label="下一页"
            icon="pi pi-chevron-right"
            iconPos="right"
            [outlined]="true"
            [disabled]="page() >= totalPages() || loading()"
            (onClick)="gotoPage(page() + 1)"
          />
        </div>
      </section>
    </section>

    <p-drawer
      [visible]="detailVisible()"
      (visibleChange)="detailVisible.set($event)"
      position="right"
      styleClass="detail-drawer"
      [blockScroll]="true"
    >
      <ng-template #header>
        <div class="drawer-title">
          <span class="eyebrow">User Detail</span>
          <strong>{{ detail()?.user?.username || selectedUser()?.username || '用户详情' }}</strong>
        </div>
      </ng-template>

      @if (detailLoading()) {
        <div class="drawer-stack">
          <p-skeleton height="92px" borderRadius="8px" />
          <p-skeleton height="180px" borderRadius="8px" />
          <p-skeleton height="180px" borderRadius="8px" />
        </div>
      } @else if (detail(); as item) {
        <div class="drawer-stack">
          <section class="detail-card detail-card--identity">
            <div class="identity-mark">{{ avatarOf(item.user) }}</div>
            <div>
              <h3>{{ item.user.username || '-' }}</h3>
              <p>{{ item.user.realName || '未填写真实姓名' }} · {{ item.user.mobile || '无手机号' }}</p>
              <p-tag [value]="stateLabel(item.user.state)" [severity]="stateSeverity(item.user.state)" />
            </div>
          </section>

          <section class="detail-card">
            <h4>账号资料</h4>
            <div class="kv">
              <span>用户 ID</span><strong>{{ item.user.id }}</strong>
              <span>邮箱</span><strong>{{ item.user.email || '-' }}</strong>
              <span>账号类型</span><strong>{{ item.user.accountType || '-' }}</strong>
              <span>默认公司</span><strong>{{ item.user.defaultCompanyId || '-' }}</strong>
              <span>创建时间</span><strong>{{ formatTime(item.user.createdAt) }}</strong>
              <span>更新时间</span><strong>{{ formatTime(item.user.updatedAt) }}</strong>
            </div>
          </section>

          <section class="detail-card">
            <div class="section-line">
              <h4>所属公司</h4>
              <span>{{ item.companies.length }} 个</span>
            </div>
            @if (item.companies.length === 0) {
              <p class="muted">暂无在职公司。</p>
            } @else {
              <div class="mini-list">
                @for (company of item.companies; track company.memberId || company.companyId) {
                  <div class="mini-item">
                    <strong>{{ company.companyName || company.companyId }}</strong>
                    <span>{{ company.memberDisplayName || '-' }} · {{ company.memberState || '-' }}</span>
                    <small>{{ formatTime(company.joinedAt) }}</small>
                  </div>
                }
              </div>
            }
          </section>

          <section class="detail-card">
            <div class="section-line">
              <h4>有效会话</h4>
              <span>{{ item.sessions.length }} 个</span>
            </div>
            @if (item.sessions.length === 0) {
              <p class="muted">暂无有效登录会话。</p>
            } @else {
              <div class="mini-list">
                @for (session of item.sessions; track session.sessionId) {
                  <div class="mini-item">
                    <strong>{{ session.deviceType || 'Unknown Device' }}</strong>
                    <span>{{ session.loginMethod || '-' }} · {{ session.ipAddress || '-' }}</span>
                    <small>最近活跃 {{ formatTime(session.lastSeenAt) }}</small>
                  </div>
                }
              </div>
            }
          </section>

          <section class="danger-zone">
            <h4>高危操作</h4>
            <div class="danger-actions">
              <p-button
                label="恢复正常"
                icon="pi pi-check"
                severity="success"
                [outlined]="true"
                [disabled]="item.user.state === 'active' || actionLoading()"
                (onClick)="changeState(item.user, 'active')"
              />
              <p-button
                label="禁用账号"
                icon="pi pi-ban"
                severity="danger"
                [outlined]="true"
                [disabled]="item.user.state === 'disabled' || actionLoading()"
                (onClick)="changeState(item.user, 'disabled')"
              />
              <p-button
                label="注销账号"
                icon="pi pi-user-minus"
                severity="danger"
                [outlined]="true"
                [disabled]="item.user.state === 'archived' || actionLoading()"
                (onClick)="changeState(item.user, 'archived')"
              />
              <p-button
                label="强制下线"
                icon="pi pi-power-off"
                severity="danger"
                [loading]="revokeLoading()"
                [disabled]="actionLoading()"
                (onClick)="revokeSessions(item.user)"
              />
            </div>
          </section>
        </div>
      } @else {
        <div class="state-block">
          <i class="pi pi-user"></i>
          <strong>未选择用户</strong>
        </div>
      }
    </p-drawer>
  `,
})
export class UsersPage implements OnInit {
  protected readonly keyword = signal('');
  protected readonly state = signal('');
  protected readonly page = signal(1);
  protected readonly size = signal(20);
  protected readonly result = signal<PageResult<SystemUser>>(emptyPage<SystemUser>());
  protected readonly summary = signal(EMPTY_USER_LIST_SUMMARY);
  protected readonly loading = signal(false);
  protected readonly summaryLoading = signal(false);
  protected readonly error = signal('');
  protected readonly summaryError = signal('');
  protected readonly selectedUser = signal<SystemUser | null>(null);
  protected readonly detail = signal<SystemUserDetail | null>(null);
  protected readonly detailVisible = signal(false);
  protected readonly detailLoading = signal(false);
  protected readonly actionLoading = signal(false);
  protected readonly revokeLoading = signal(false);
  protected readonly stateOptions = USER_STATE_OPTIONS;
  protected readonly skeletonRows = Array.from({ length: 6 }, (_, index) => index);
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.result().total / this.result().size)),
  );
  protected readonly stateSummaryItems = computed(() => {
    const summary = this.summary();
    return [
      { label: '全部', value: '', count: summary.total, icon: 'pi pi-users' },
      { label: '正常', value: 'active', count: summary.active, icon: 'pi pi-check-circle' },
      { label: '禁用', value: 'disabled', count: summary.disabled, icon: 'pi pi-ban' },
      { label: '注销', value: 'archived', count: summary.archived, icon: 'pi pi-user-minus' },
      { label: '删除', value: 'deleted', count: summary.deleted, icon: 'pi pi-trash' },
    ];
  });
  protected readonly companySummaryItems = computed(() => {
    const summary = this.summary();
    return [
      { label: '有公司', count: summary.withCompany, icon: 'pi pi-building' },
      { label: '无公司', count: summary.withoutCompany, icon: 'pi pi-minus-circle' },
    ];
  });

  private readonly api = inject(SystemService);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  ngOnInit(): void {
    this.load();
  }

  search(): void {
    this.page.set(1);
    this.load();
  }

  setState(value: string): void {
    this.state.set(value);
    this.search();
  }

  selectSummaryState(value: string): void {
    if (this.state() === value) {
      return;
    }
    this.setState(value);
  }

  gotoPage(nextPage: number): void {
    this.page.set(Math.min(Math.max(1, nextPage), this.totalPages()));
    this.load();
  }

  load(): void {
    this.loadSummary();
    this.loading.set(true);
    this.error.set('');
    this.api
      .queryUsers({
        keyword: this.keyword().trim(),
        state: this.state(),
        page: this.page(),
        size: this.size(),
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (page) => this.result.set(page ?? emptyPage<SystemUser>()),
        error: (err: unknown) => this.error.set(this.messageOf(err)),
      });
  }

  private loadSummary(): void {
    this.summaryLoading.set(true);
    this.summaryError.set('');
    this.api
      .userListSummary({
        keyword: this.keyword().trim(),
        state: this.state(),
      })
      .pipe(finalize(() => this.summaryLoading.set(false)))
      .subscribe({
        next: (summary) => this.summary.set(summary ?? EMPTY_USER_LIST_SUMMARY),
        error: (err: unknown) => this.summaryError.set(this.messageOf(err)),
      });
  }

  openDetail(user: SystemUser): void {
    this.selectedUser.set(user);
    this.detailVisible.set(true);
    this.detailLoading.set(true);
    this.detail.set(null);
    this.api
      .userDetail(user.id)
      .pipe(finalize(() => this.detailLoading.set(false)))
      .subscribe({
        next: (detail) => this.detail.set({
          ...detail,
          companies: detail.companies ?? [],
          sessions: detail.sessions ?? [],
        }),
        error: (err: unknown) => this.toast.error(this.messageOf(err)),
      });
  }

  async changeState(user: SystemUser, state: 'active' | 'disabled' | 'archived'): Promise<void> {
    const ok = await this.confirm.ask({
      title: this.stateActionTitle(state),
      message: `目标账号: ${user.username || user.mobile || user.id}`,
      confirmText: this.stateActionText(state),
      cancelText: '取消',
      danger: state !== 'active',
    });
    if (!ok) return;

    this.actionLoading.set(true);
    this.api
      .updateUserState(user.id, state)
      .pipe(finalize(() => this.actionLoading.set(false)))
      .subscribe({
        next: (updated) => {
          this.toast.success('用户状态已更新');
          this.patchUser(updated);
          this.loadSummary();
          if (this.detail()?.user.id === updated.id) {
            this.detail.update((detail) => detail ? { ...detail, user: updated } : detail);
          }
        },
        error: (err: unknown) => this.toast.error(this.messageOf(err)),
      });
  }

  async revokeSessions(user: SystemUser): Promise<void> {
    const ok = await this.confirm.ask({
      title: '强制下线该用户',
      message: '该用户所有设备上的普通登录会话都会被撤销。',
      confirmText: '强制下线',
      cancelText: '取消',
      danger: true,
    });
    if (!ok) return;

    this.revokeLoading.set(true);
    this.api
      .revokeUserSessions(user.id)
      .pipe(finalize(() => this.revokeLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.success('用户会话已撤销');
          this.openDetail(user);
        },
        error: (err: unknown) => this.toast.error(this.messageOf(err)),
      });
  }

  protected stateLabel(state?: string): string {
    const map: Record<string, string> = {
      active: '正常',
      disabled: '禁用',
      archived: '注销',
      deleted: '删除',
    };
    return state ? map[state] ?? state : '-';
  }

  protected stateSeverity(state?: string): 'success' | 'danger' | 'warn' | 'secondary' | 'info' {
    if (state === 'active') return 'success';
    if (state === 'disabled') return 'danger';
    if (state === 'archived') return 'warn';
    return 'secondary';
  }

  protected avatarOf(user?: SystemUser | null): string {
    const name = user?.username || user?.realName || user?.mobile || 'U';
    return name.slice(0, 1).toUpperCase();
  }

  protected formatTime(value?: number): string {
    if (!value) return '-';
    return new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  }

  private patchUser(updated: SystemUser): void {
    this.result.update((page) => ({
      ...page,
      items: page.items.map((item) => (item.id === updated.id ? updated : item)),
    }));
  }

  private stateActionTitle(state: string): string {
    if (state === 'active') return '恢复用户账号';
    if (state === 'disabled') return '禁用用户账号';
    return '注销用户账号';
  }

  private stateActionText(state: string): string {
    if (state === 'active') return '恢复';
    if (state === 'disabled') return '禁用';
    return '注销';
  }

  private messageOf(err: unknown): string {
    return err instanceof Error ? err.message : '请求失败';
  }
}
