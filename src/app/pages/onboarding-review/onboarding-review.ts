import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmService } from '../../core/feedback/confirm.service';
import { ToastService } from '../../core/feedback/toast.service';
import { SystemService } from '../../features/system/system.service';
import {
  APPLY_STATE_OPTIONS,
  CompanyApply,
} from '../../features/system/system.model';
import { PageResult, emptyPage } from '../../shared/models/page-result';

type ReviewAction = 'approve' | 'reject';

@Component({
  selector: 'app-onboarding-review-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ButtonModule,
    DrawerModule,
    InputTextModule,
    SelectModule,
    SkeletonModule,
    TagModule,
    TextareaModule,
    TooltipModule,
  ],
  styleUrl: './onboarding-review.scss',
  template: `
    <section class="page">
      <div class="toolbar">
        <p-select
          [options]="stateOptions"
          optionLabel="label"
          optionValue="value"
          [ngModel]="state()"
          (ngModelChange)="setState($event)"
          styleClass="state-select"
        />
        <span class="toolbar__spacer"></span>
        <p-button icon="pi pi-refresh" label="刷新" [text]="true" (onClick)="load()" />
      </div>

      <section class="review-grid">
        <aside class="queue-panel">
          <div class="queue-panel__head">
            <div>
              <strong>申请队列</strong>
              <span>共 {{ result().total }} 条</span>
            </div>
            <span>{{ result().page }} / {{ totalPages() }}</span>
          </div>

          @if (loading()) {
            <div class="skeleton-list">
              @for (row of skeletonRows; track row) {
                <p-skeleton height="92px" borderRadius="8px" />
              }
            </div>
          } @else if (error()) {
            <div class="state-block state-block--error">
              <i class="pi pi-exclamation-triangle"></i>
              <strong>申请队列加载失败</strong>
              <p>{{ error() }}</p>
              <p-button label="重试" icon="pi pi-refresh" [outlined]="true" (onClick)="load()" />
            </div>
          } @else if (result().items.length === 0) {
            <div class="state-block">
              <i class="pi pi-inbox"></i>
              <strong>暂无申请</strong>
              <p>当前筛选条件下没有入驻申请。</p>
            </div>
          } @else {
            <div class="apply-list">
              @for (item of result().items; track item.id) {
                <button
                  class="apply-card"
                  [class.apply-card--active]="selected()?.id === item.id"
                  type="button"
                  (click)="openDetail(item)"
                >
                  <span class="apply-card__mark">
                    <i class="pi pi-building"></i>
                  </span>
                  <span class="apply-card__body">
                    <strong>{{ item.companyName || '-' }}</strong>
                    <small>{{ item.contactName || '-' }} · {{ item.contactMobile || '-' }}</small>
                    <span>{{ formatTime(item.createdAt) }}</span>
                  </span>
                  <p-tag [value]="stateLabel(item.state)" [severity]="stateSeverity(item.state)" />
                </button>
              }
            </div>
          }

          <div class="pager">
            <p-button
              icon="pi pi-chevron-left"
              [text]="true"
              ariaLabel="上一页"
              [disabled]="page() <= 1 || loading()"
              (onClick)="gotoPage(page() - 1)"
            />
            <span>{{ page() }} / {{ totalPages() }}</span>
            <p-button
              icon="pi pi-chevron-right"
              [text]="true"
              ariaLabel="下一页"
              [disabled]="page() >= totalPages() || loading()"
              (onClick)="gotoPage(page() + 1)"
            />
          </div>
        </aside>

        <section class="preview-panel">
          @if (selected(); as item) {
            <div class="preview-card">
              <span class="eyebrow">Review Preview</span>
              <h3>{{ item.companyName || '-' }}</h3>
              <p>{{ item.contactName || '-' }} · {{ item.contactMobile || '-' }}</p>
              <div class="preview-meta">
                <span>申请人</span><strong>{{ item.applicantUserId || '-' }}</strong>
                <span>Owner 手机</span><strong>{{ item.ownerMobile || '-' }}</strong>
                <span>创建时间</span><strong>{{ formatTime(item.createdAt) }}</strong>
                <span>状态</span>
                <strong>
                  <p-tag [value]="stateLabel(item.state)" [severity]="stateSeverity(item.state)" />
                </strong>
              </div>
              <div class="preview-actions">
                <p-button label="查看详情" icon="pi pi-eye" [outlined]="true" (onClick)="openDetail(item)" />
                <p-button
                  label="通过"
                  icon="pi pi-check"
                  severity="success"
                  [disabled]="item.state !== 'pending'"
                  (onClick)="startReview(item, 'approve')"
                />
                <p-button
                  label="拒绝"
                  icon="pi pi-times"
                  severity="danger"
                  [outlined]="true"
                  [disabled]="item.state !== 'pending'"
                  (onClick)="startReview(item, 'reject')"
                />
              </div>
            </div>
          } @else {
            <div class="empty-preview">
              <i class="pi pi-building"></i>
              <strong>选择一条申请</strong>
              <p>右侧会展示审核上下文和操作入口。</p>
            </div>
          }
        </section>
      </section>
    </section>

    <p-drawer
      [visible]="detailVisible()"
      (visibleChange)="detailVisible.set($event)"
      position="right"
      styleClass="review-drawer"
      [blockScroll]="true"
    >
      <ng-template #header>
        <div class="drawer-title">
          <span class="eyebrow">Application Detail</span>
          <strong>{{ detail()?.companyName || selected()?.companyName || '申请详情' }}</strong>
        </div>
      </ng-template>

      @if (detailLoading()) {
        <div class="drawer-stack">
          <p-skeleton height="120px" borderRadius="8px" />
          <p-skeleton height="220px" borderRadius="8px" />
        </div>
      } @else if (detail(); as item) {
        <div class="drawer-stack">
          <section class="detail-card detail-card--hero">
            <div>
              <span class="eyebrow">Company</span>
              <h3>{{ item.companyName || '-' }}</h3>
              <p>{{ item.contactName || '-' }} · {{ item.contactMobile || '-' }}</p>
            </div>
            <p-tag [value]="stateLabel(item.state)" [severity]="stateSeverity(item.state)" />
          </section>

          <section class="detail-card">
            <h4>申请上下文</h4>
            <div class="kv">
              <span>申请 ID</span><strong>{{ item.id }}</strong>
              <span>申请人 ID</span><strong>{{ item.applicantUserId || '-' }}</strong>
              <span>Owner 手机</span><strong>{{ item.ownerMobile || '-' }}</strong>
              <span>创建时间</span><strong>{{ formatTime(item.createdAt) }}</strong>
              <span>更新时间</span><strong>{{ formatTime(item.updatedAt) }}</strong>
              <span>撤销时间</span><strong>{{ formatTime(item.cancelledAt) }}</strong>
            </div>
          </section>

          <section class="detail-card">
            <h4>审核结果</h4>
            <div class="kv">
              <span>审核人</span><strong>{{ item.reviewedBy || '-' }}</strong>
              <span>审核时间</span><strong>{{ formatTime(item.reviewedAt) }}</strong>
              <span>创建公司</span><strong>{{ item.approvedCompanyId || '-' }}</strong>
              <span>创建成员</span><strong>{{ item.approvedMemberId || '-' }}</strong>
              <span>审核说明</span><strong>{{ item.reviewReason || '-' }}</strong>
            </div>
          </section>

          @if (item.state === 'pending') {
            <section class="review-box">
              <h4>审核操作</h4>
              <label>
                <span>审核备注</span>
                <textarea
                  pTextarea
                  rows="4"
                  maxlength="500"
                  placeholder="可填写通过说明或拒绝原因"
                  [ngModel]="reason()"
                  (ngModelChange)="reason.set($event)"
                ></textarea>
              </label>
              <div class="review-actions">
                <p-button
                  label="通过申请"
                  icon="pi pi-check"
                  severity="success"
                  [loading]="reviewLoading() && action() === 'approve'"
                  [disabled]="reviewLoading()"
                  (onClick)="submitReview(item, 'approve')"
                />
                <p-button
                  label="拒绝申请"
                  icon="pi pi-times"
                  severity="danger"
                  [outlined]="true"
                  [loading]="reviewLoading() && action() === 'reject'"
                  [disabled]="reviewLoading()"
                  (onClick)="submitReview(item, 'reject')"
                />
              </div>
            </section>
          }
        </div>
      }
    </p-drawer>
  `,
})
export class OnboardingReviewPage implements OnInit {
  protected readonly state = signal('pending');
  protected readonly page = signal(1);
  protected readonly size = signal(20);
  protected readonly result = signal<PageResult<CompanyApply>>(emptyPage<CompanyApply>());
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly selected = signal<CompanyApply | null>(null);
  protected readonly detail = signal<CompanyApply | null>(null);
  protected readonly detailVisible = signal(false);
  protected readonly detailLoading = signal(false);
  protected readonly reason = signal('');
  protected readonly reviewLoading = signal(false);
  protected readonly action = signal<ReviewAction | null>(null);
  protected readonly stateOptions = APPLY_STATE_OPTIONS;
  protected readonly skeletonRows = Array.from({ length: 5 }, (_, index) => index);
  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.result().total / this.result().size)),
  );

  private readonly api = inject(SystemService);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  ngOnInit(): void {
    this.load();
  }

  setState(value: string): void {
    this.state.set(value);
    this.page.set(1);
    this.load();
  }

  gotoPage(nextPage: number): void {
    this.page.set(Math.min(Math.max(1, nextPage), this.totalPages()));
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api
      .queryApplications({
        state: this.state(),
        page: this.page(),
        size: this.size(),
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (page) => {
          this.result.set(page ?? emptyPage<CompanyApply>());
          const current = this.selected();
          const next = page?.items?.find((item) => item.id === current?.id) ?? page?.items?.[0] ?? null;
          this.selected.set(next);
        },
        error: (err: unknown) => this.error.set(this.messageOf(err)),
      });
  }

  openDetail(item: CompanyApply): void {
    this.selected.set(item);
    this.detailVisible.set(true);
    this.detailLoading.set(true);
    this.reason.set('');
    this.api
      .applicationDetail(item.id)
      .pipe(finalize(() => this.detailLoading.set(false)))
      .subscribe({
        next: (detail) => {
          this.detail.set(detail);
          this.patchApplication(detail);
          this.selected.set(detail);
        },
        error: (err: unknown) => this.toast.error(this.messageOf(err)),
      });
  }

  startReview(item: CompanyApply, action: ReviewAction): void {
    this.openDetail(item);
    this.action.set(action);
  }

  async submitReview(item: CompanyApply, action: ReviewAction): Promise<void> {
    const ok = await this.confirm.ask({
      title: action === 'approve' ? '通过入驻申请' : '拒绝入驻申请',
      message: `公司: ${item.companyName || item.id}`,
      confirmText: action === 'approve' ? '通过' : '拒绝',
      cancelText: '取消',
      danger: action === 'reject',
    });
    if (!ok) return;

    this.action.set(action);
    this.reviewLoading.set(true);
    const request = { reason: this.reason().trim() || undefined };
    const call =
      action === 'approve'
        ? this.api.approveApplication(item.id, request)
        : this.api.rejectApplication(item.id, request);

    call.pipe(finalize(() => this.reviewLoading.set(false))).subscribe({
      next: (updated) => {
        this.toast.success(action === 'approve' ? '入驻申请已通过' : '入驻申请已拒绝');
        this.detail.set(updated);
        this.selected.set(updated);
        this.patchApplication(updated);
        this.reason.set('');
      },
      error: (err: unknown) => this.toast.error(this.messageOf(err)),
    });
  }

  protected stateLabel(state?: string): string {
    const map: Record<string, string> = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
      cancelled: '已撤销',
      '': '全部状态',
    };
    return state !== undefined ? map[state] ?? state : '-';
  }

  protected stateSeverity(state?: string): 'success' | 'danger' | 'warn' | 'secondary' | 'info' {
    if (state === 'approved') return 'success';
    if (state === 'rejected') return 'danger';
    if (state === 'pending') return 'warn';
    return 'secondary';
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

  private patchApplication(updated: CompanyApply): void {
    this.result.update((page) => ({
      ...page,
      items: page.items.map((item) => (item.id === updated.id ? updated : item)),
    }));
  }

  private messageOf(err: unknown): string {
    return err instanceof Error ? err.message : '请求失败';
  }
}
