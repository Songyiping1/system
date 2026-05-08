import { Component, computed, effect, HostListener, inject, input, output, signal, OnInit } from '@angular/core';
import { PositionApiService, RoleApiService, OrganizeApiService } from '../../../api';
import type { RoleVo, TreeNodeOrganize } from '../../../api/types';
import { AuthService } from '../../../services/auth.service';

interface DeptOption {
  id: string;
  name: string;
  depth: number;
}

interface RoleTreeFlatNode {
  id: string;
  name: string;
  type: 'group' | 'role';
  depth: number;
}

@Component({
  selector: 'app-position-add-drawer',
  standalone: true,
  templateUrl: './position-add-drawer.component.html',
  styleUrl: './position-add-drawer.component.scss',
})
export class PositionAddDrawerComponent implements OnInit {
  private positionApi = inject(PositionApiService);
  private roleApi = inject(RoleApiService);
  private organizeApi = inject(OrganizeApiService);
  private auth = inject(AuthService);

  visible = input(false);
  editMode = input(false);
  editPositionId = input<string | null>(null);
  editName = input('');
  editDeptId = input<string | null>(null);
  editRoleIds = input<string[]>([]);

  closed = output<void>();
  saved = output<void>();

  name = signal('');
  description = signal('');
  selectedRoleIds = signal<string[]>([]);
  selectedDeptId = signal<string | null>(null);

  roleOptions = signal<RoleTreeFlatNode[]>([]);
  deptOptions = signal<DeptOption[]>([]);

  roleDropdownOpen = signal(false);
  deptDropdownOpen = signal(false);

  title = computed(() => this.editMode() ? '编辑岗位' : '新建岗位');
  canSave = computed(() => this.name().trim().length > 0);

  selectedRoleLabel = computed(() => {
    const ids = this.selectedRoleIds();
    if (!ids.length) return '';
    const names = this.roleOptions().filter(r => r.type === 'role' && ids.includes(r.id)).map(r => r.name);
    return names.join('、');
  });

  selectedDeptLabel = computed(() => {
    const id = this.selectedDeptId();
    if (!id) return '';
    return this.deptOptions().find(d => d.id === id)?.name ?? '';
  });

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.name.set(this.editMode() ? this.editName() : '');
        this.description.set('');
        this.selectedRoleIds.set(this.editMode() ? [...this.editRoleIds()] : []);
        this.selectedDeptId.set(this.editMode() ? this.editDeptId() : null);
        this.roleDropdownOpen.set(false);
        this.deptDropdownOpen.set(false);
      }
    });
  }

  ngOnInit() {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.roleApi.listRole({ companyId }).subscribe({
      next: list => this.roleOptions.set(this.flattenRoles(list)),
      error: () => this.roleOptions.set([]),
    });
    this.organizeApi.loadOrganize({ companyId }).subscribe({
      next: tree => this.deptOptions.set(this.flattenDept(tree, 0)),
      error: () => this.deptOptions.set([]),
    });
  }

  private flattenRoles(nodes: RoleVo[] | undefined, depth = 0): RoleTreeFlatNode[] {
    if (!nodes) return [];
    const out: RoleTreeFlatNode[] = [];
    for (const n of nodes) {
      const type = (n.type ?? 'role') === 'group' ? 'group' : 'role';
      if (n.id) out.push({ id: n.id, name: n.name ?? '', type, depth });
      if (n.children?.length) out.push(...this.flattenRoles(n.children, depth + 1));
    }
    return out;
  }

  private flattenDept(nodes: TreeNodeOrganize[] | undefined, depth: number): DeptOption[] {
    if (!nodes) return [];
    const out: DeptOption[] = [];
    for (const n of nodes) {
      if (n.id) out.push({ id: n.id, name: n.name ?? '', depth });
      if (n.children?.length) out.push(...this.flattenDept(n.children, depth + 1));
    }
    return out;
  }

  toggleRoleDropdown(event: Event) {
    event.stopPropagation();
    this.deptDropdownOpen.set(false);
    this.roleDropdownOpen.update(v => !v);
  }

  toggleDeptDropdown(event: Event) {
    event.stopPropagation();
    this.roleDropdownOpen.set(false);
    this.deptDropdownOpen.update(v => !v);
  }

  toggleRole(id: string, event: Event) {
    event.stopPropagation();
    this.selectedRoleIds.update(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id]);
  }

  selectDept(id: string, event: Event) {
    event.stopPropagation();
    this.selectedDeptId.set(id);
    this.deptDropdownOpen.set(false);
  }

  clearDept(event: Event) {
    event.stopPropagation();
    this.selectedDeptId.set(null);
  }

  onPanelClick() {
    if (this.roleDropdownOpen()) this.roleDropdownOpen.set(false);
    if (this.deptDropdownOpen()) this.deptDropdownOpen.set(false);
  }

  onClose() {
    this.closed.emit();
  }

  onSave() {
    if (!this.canSave()) return;
    const companyId = this.auth.currentUser()?.companyId ?? '';
    const body = {
      name: this.name().trim(),
      companyId,
      deptId: this.selectedDeptId() ?? undefined,
      roleIds: this.selectedRoleIds().length ? this.selectedRoleIds() : undefined,
      ...(this.editMode() ? { id: this.editPositionId() ?? '' } : {}),
    };
    const req$ = this.editMode() ? this.positionApi.updatePosition(body) : this.positionApi.createPosition(body);
    req$.subscribe({ next: () => this.saved.emit() });
  }
}
