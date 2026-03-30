import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, FilterSelectComponent, TypeBadgeComponent } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';
import { OrganizeBusinessApiService, OrganizeMemberApiService } from '../../api';
import { type BizDict } from '../../api/types/common.type';
import { type OrganizeUserVo } from '../../api/types/organize.type';
import { AuthService } from '../../services/auth.service';

interface PermissionRow {
  id: string;
  admin: string;
  adminAvatar: string;
  adminBadge: string;
  dept: string;
  jobNo: string;
  scope: string;
  addedBy: string;
  addedByAvatar: string;
  time: string;
}

@Component({
  selector: 'app-member-permission',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, FilterSelectComponent, TypeBadgeComponent],
  templateUrl: './member-permission.component.html',
  styleUrl: './member-permission.component.scss',
})
export class MemberPermissionComponent implements OnInit {
  private businessApi = inject(OrganizeBusinessApiService);
  private memberApi = inject(OrganizeMemberApiService);
  private auth = inject(AuthService);

  pageState = signal<PageState>('loading');
  searchKeyword = signal('');

  businessModules = signal<BizDict[]>([]);
  permissionList = signal<PermissionRow[]>([]);

  isLoading = computed(() => this.pageState() === 'loading');

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.pageState.set('loading');
    const companyId = this.auth.currentUser()?.companyId ?? '';

    this.businessApi.getBusinessList({ companyId }).subscribe({
      next: (res) => {
        this.businessModules.set(res);
      },
    });

    this.memberApi.listOrganizeMember({ companyId, deptId: '' }).subscribe({
      next: (res) => {
        this.permissionList.set(res.map(m => ({
          id: m.userId ?? '',
          admin: m.name ?? m.userName ?? '',
          adminAvatar: (m.name ?? m.userName ?? '').charAt(0),
          adminBadge: '',
          dept: m.deptName ?? '',
          jobNo: '',
          scope: '',
          addedBy: '',
          addedByAvatar: '',
          time: '',
        })));
        this.pageState.set(res.length > 0 ? 'normal' : 'empty');
      },
      error: () => this.pageState.set('error'),
    });
  }

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }
}
