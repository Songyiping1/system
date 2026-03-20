import { Component, signal, computed } from '@angular/core';
import { PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent, StatsRowComponent, StatusBadgeComponent, type StatItem } from '../../shared/components';
import { type PageState } from '../../shared/models/page-state';

interface OrgRow {
  name: string;
  icon: string;
  count: number;
  dept: string;
  status: string;
}

@Component({
  selector: 'app-group-hierarchy',
  standalone: true,
  imports: [PageHeaderComponent, SearchInputComponent, ActionBarComponent, ButtonComponent, StatsRowComponent, StatusBadgeComponent],
  templateUrl: './group-hierarchy.component.html',
  styleUrl: './group-hierarchy.component.scss',
})
export class GroupHierarchyComponent {
  pageState = signal<PageState>('normal');
  searchKeyword = signal('');

  stats: StatItem[] = [
    { label: '上级组织', value: 2 },
    { label: '下级组织', value: 25 },
    { label: '本组织人数', value: 54 },
    { label: '直属下级组织人数合', value: 1244 },
  ];

  orgList = signal<OrgRow[]>([
    { name: '天诚', icon: '天', count: 120, dept: '技术部', status: '正常' },
    { name: '浩鑫集团', icon: '浩', count: 340, dept: '运营部', status: '正常' },
    { name: 'ACE Studio', icon: 'A', count: 56, dept: '产品部', status: '正常' },
    { name: 'FOCO', icon: 'F', count: 89, dept: '市场部', status: '已停用' },
    { name: '天格环慧', icon: '天', count: 210, dept: '技术部', status: '正常' },
    { name: 'Painting', icon: 'P', count: 34, dept: '设计部', status: '已注销' },
    { name: 'miniCo', icon: 'm', count: 15, dept: '研发部', status: '正常' },
    { name: '华通电力', icon: '华', count: 167, dept: '工程部', status: '正常' },
    { name: '惠华集团', icon: '惠', count: 98, dept: '财务部', status: '已停用' },
    { name: '国药集团', icon: '国', count: 450, dept: '医药部', status: '正常' },
    { name: '国控星鲨', icon: '国', count: 78, dept: '销售部', status: '正常' },
  ]);

  isLoading = computed(() => this.pageState() === 'loading');

  onSearch(keyword: string) {
    this.searchKeyword.set(keyword);
  }
}
