import { Component, input, output, signal, inject } from '@angular/core';
import { ModalComponent } from '../../../shared/components';
import { OrganizeMemberApiService } from '../../../api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-member-import-modal',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './member-import-modal.component.html',
  styleUrl: './member-import-modal.component.scss',
})
export class MemberImportModalComponent {
  private memberApi = inject(OrganizeMemberApiService);
  private auth = inject(AuthService);

  visible = input(false);
  deptId = input('');
  closed = output<void>();
  imported = output<void>();

  activeTab = signal<'import' | 'export'>('import');
  importFile = signal<File | null>(null);
  isDragging = signal(false);

  onClose() {
    this.importFile.set(null);
    this.activeTab.set('import');
    this.closed.emit();
  }

  onDownloadTemplate() {
    const companyId = this.auth.currentUser()?.companyId ?? '';
    this.memberApi.downloadTemplate({ companyId }).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '员工导入模板.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      },
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.importFile.set(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.importFile.set(file);
  }

  onImport() {
    const file = this.importFile();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', this.auth.currentUser()?.companyId ?? '');
    formData.append('deptId', this.deptId());
    this.memberApi.importMember(formData).subscribe({
      next: () => {
        this.imported.emit();
        this.onClose();
      },
    });
  }

  onExport() {
    // 导出当前成员信息（复用下载模板接口）
    this.onDownloadTemplate();
  }
}
