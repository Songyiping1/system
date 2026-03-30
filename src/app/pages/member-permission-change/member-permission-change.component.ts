import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, ActionBarComponent, FilterSelectComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { OrganizeApiService } from '../../api';
import { type PermissionLogVo } from '../../api/types/organize.type';
import { AuthService } from '../../services/auth.service';

interface ChangeRow {
  target: string;
  targetAvatar: string;
  operator: string;
  operatorAvatar: string;
  dept: string;
  eventType: string;
  eventDesc: string;
  time: string;
}

@Component({
  selector: 'app-member-permission-change',
  standalone: true,
  imports: [PageHeaderComponent, ActionBarComponent, FilterSelectComponent],
  templateUrl: './member-permission-change.component.html',
  styleUrl: './member-permission-change.component.scss',
})
export class MemberPermissionChangeComponent implements OnInit {
  private organizeApi = inject(OrganizeApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');

  changeList = signal<ChangeRow[]>([]);

  isLoading = computed(() => this.pageState() === 'loading');

  ngOnInit() {
    this.loadPermissionList();
  }

  loadPermissionList(userId?: string, startTime?: string, endTime?: string) {
    this.pageState.set('loading');
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.organizeApi.getPermissionList({ companyId, userId, startTime, endTime }).subscribe({
      next: (res) => {
        this.changeList.set(res.map(log => ({
          target: '',
          targetAvatar: '',
          operator: log.operateUserName ?? '',
          operatorAvatar: (log.operateUserName ?? '').charAt(0),
          dept: '',
          eventType: log.type ?? '',
          eventDesc: log.description ?? '',
          time: log.createTime ?? '',
        })));
        this.pageState.set(res.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }
}
