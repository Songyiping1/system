import { Component, signal } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ActionBarComponent } from '../../shared/components/action-bar/action-bar.component';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ColumnDef } from '../../shared/models';

interface PositionRow {
  key: string;
  name: string;
  code: string;
  memberCount: number;
  createdAt: string;
}

@Component({
  selector: 'app-position-manage',
  imports: [PageHeaderComponent, ActionBarComponent, SearchInputComponent, ButtonComponent],
  templateUrl: './position-manage.html',
  styleUrl: './position-manage.scss',
})
export class PositionManage {
  readonly searchValue = signal('');

  readonly columns = signal<ColumnDef[]>([
    { key: 'name', label: '岗位名称' },
    { key: 'code', label: '岗位编码' },
    { key: 'memberCount', label: '关联人数' },
    { key: 'createdAt', label: '创建时间' },
    { key: 'actions', label: '操作' },
  ]);

  readonly rows = signal<PositionRow[]>([
    { key: '1', name: '前端开发', code: 'POS-FE-001', memberCount: 12, createdAt: '2025-06-15 09:00' },
    { key: '2', name: '后端开发', code: 'POS-BE-002', memberCount: 18, createdAt: '2025-06-15 09:00' },
    { key: '3', name: '产品经理', code: 'POS-PM-003', memberCount: 6, createdAt: '2025-06-16 10:30' },
    { key: '4', name: 'UI设计师', code: 'POS-UI-004', memberCount: 4, createdAt: '2025-06-16 10:30' },
    { key: '5', name: '测试工程师', code: 'POS-QA-005', memberCount: 8, createdAt: '2025-07-01 14:00' },
    { key: '6', name: '运维工程师', code: 'POS-OPS-006', memberCount: 3, createdAt: '2025-07-10 11:20' },
    { key: '7', name: '项目经理', code: 'POS-PJM-007', memberCount: 5, createdAt: '2025-08-05 16:45' },
    { key: '8', name: '数据分析师', code: 'POS-DA-008', memberCount: 2, createdAt: '2025-09-12 08:30' },
  ]);
}
