import { Component, computed, inject, input, output, signal, effect } from '@angular/core';
import { ModalComponent } from '../../shared/components';
import { OrganizeApiService, OrganizeMemberApiService } from '../../api';
import type { TreeNodeOrganize, OrganizeUserVo } from '../../api/types';

interface PickedUser {
  id: string;
  name: string;
}

interface DeptCrumb {
  id: string;
  name: string;
  children: TreeNodeOrganize[];
}

@Component({
  selector: 'app-member-picker-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './member-picker-modal.component.html',
  styleUrl: './member-picker-modal.component.scss',
})
export class MemberPickerModalComponent {
  private organizeApi = inject(OrganizeApiService);
  private memberApi = inject(OrganizeMemberApiService);

  visible = input(false);
  companyId = input.required<string>();

  closed = output<void>();
  confirmed = output<PickedUser[]>();

  keyword = signal('');
  rootTree = signal<TreeNodeOrganize[]>([]);
  crumbs = signal<DeptCrumb[]>([]); // 当前导航路径
  currentMembers = signal<OrganizeUserVo[]>([]);
  selected = signal<Map<string, PickedUser>>(new Map());

  selectedList = computed(() => Array.from(this.selected().values()));
  selectedCount = computed(() => this.selectedList().length);

  currentChildren = computed<TreeNodeOrganize[]>(() => {
    const cs = this.crumbs();
    if (cs.length === 0) return this.rootTree();
    return cs[cs.length - 1].children ?? [];
  });

  filteredChildren = computed(() => {
    const k = this.keyword().trim().toLowerCase();
    const list = this.currentChildren();
    if (!k) return list;
    return list.filter(d => (d.name ?? '').toLowerCase().includes(k));
  });

  filteredMembers = computed(() => {
    const k = this.keyword().trim().toLowerCase();
    const list = this.currentMembers();
    if (!k) return list;
    return list.filter(u => (u.name ?? u.userName ?? '').toLowerCase().includes(k));
  });

  allChecked = computed(() => {
    const sel = this.selected();
    const ms = this.filteredMembers();
    return ms.length > 0 && ms.every(m => sel.has(m.userId ?? ''));
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.loadTree();
      }
    });
  }

  private loadTree() {
    this.crumbs.set([]);
    this.currentMembers.set([]);
    this.keyword.set('');
    this.organizeApi.loadOrganize({ companyId: this.companyId() }).subscribe({
      next: (tree) => this.rootTree.set(tree ?? []),
    });
  }

  enterDept(dept: TreeNodeOrganize) {
    this.crumbs.update(cs => [...cs, { id: dept.id ?? '', name: dept.name ?? '', children: dept.children ?? [] }]);
    this.loadMembers(dept.id ?? '');
  }

  goToCrumb(index: number) {
    if (index < 0) {
      this.crumbs.set([]);
      this.currentMembers.set([]);
      return;
    }
    this.crumbs.update(cs => cs.slice(0, index + 1));
    const last = this.crumbs()[index];
    if (last) this.loadMembers(last.id);
  }

  private loadMembers(deptId: string) {
    if (!deptId) {
      this.currentMembers.set([]);
      return;
    }
    this.memberApi.listOrganizeMember({ companyId: this.companyId(), deptId }).subscribe({
      next: (res) => this.currentMembers.set(res ?? []),
    });
  }

  toggleUser(u: OrganizeUserVo) {
    const id = u.userId ?? '';
    if (!id) return;
    this.selected.update(m => {
      const next = new Map(m);
      if (next.has(id)) next.delete(id);
      else next.set(id, { id, name: u.name ?? u.userName ?? '' });
      return next;
    });
  }

  isUserChecked(u: OrganizeUserVo): boolean {
    return this.selected().has(u.userId ?? '');
  }

  toggleAll() {
    const ms = this.filteredMembers();
    if (this.allChecked()) {
      this.selected.update(m => {
        const next = new Map(m);
        ms.forEach(u => next.delete(u.userId ?? ''));
        return next;
      });
    } else {
      this.selected.update(m => {
        const next = new Map(m);
        ms.forEach(u => {
          const id = u.userId ?? '';
          if (id) next.set(id, { id, name: u.name ?? u.userName ?? '' });
        });
        return next;
      });
    }
  }

  removeSelected(id: string) {
    this.selected.update(m => {
      const next = new Map(m);
      next.delete(id);
      return next;
    });
  }

  initialOf(name: string): string {
    return (name || '').charAt(0);
  }

  onConfirm() {
    this.confirmed.emit(this.selectedList());
    this.selected.set(new Map());
  }

  onClose() {
    this.selected.set(new Map());
    this.closed.emit();
  }
}
