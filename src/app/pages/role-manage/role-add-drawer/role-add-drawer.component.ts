import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { RoleApiService } from '../../../api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-role-add-drawer',
  standalone: true,
  templateUrl: './role-add-drawer.component.html',
  styleUrl: './role-add-drawer.component.scss',
})
export class RoleAddDrawerComponent {
  private roleApi = inject(RoleApiService);
  private auth = inject(AuthService);

  visible = input(false);
  /** 编辑模式 */
  editMode = input(false);
  /** 编辑时的角色 id */
  editRoleId = input<string | null>(null);
  /** 编辑时的初始名称 */
  editName = input('');
  /** 编辑时的初始描述 */
  editDescription = input('');
  /** 所属分组 id（创建时） */
  groupId = input<string | null>(null);

  closed = output<void>();
  saved = output<void>();

  name = signal('');
  description = signal('');

  title = computed(() => this.editMode() ? '编辑角色' : '新增角色');
  canSave = computed(() => this.name().trim().length > 0);

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.name.set(this.editMode() ? this.editName() : '');
        this.description.set(this.editMode() ? this.editDescription() : '');
      }
    });
  }

  onClose() {
    this.closed.emit();
  }

  onSave() {
    if (!this.canSave()) return;
    const companyId = this.auth.currentUser()?.companyId ?? '';
    const name = this.name().trim();
    const description = this.description().trim() || undefined;

    if (this.editMode()) {
      this.roleApi.updateRole({
        id: this.editRoleId() ?? '',
        name,
        companyId,
        description,
        type: 'role',
      }).subscribe({
        next: () => this.saved.emit(),
      });
    } else {
      this.roleApi.createRole({
        name,
        companyId,
        description,
        type: 'role',
        groupId: this.groupId() ?? undefined,
      }).subscribe({
        next: () => this.saved.emit(),
      });
    }
  }
}
