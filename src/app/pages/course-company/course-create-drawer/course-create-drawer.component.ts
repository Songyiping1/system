import { Component, input, output, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyApiService } from '../../../api';
import { type CompanyUpsertCommand } from '../../../api/types/company.type';

@Component({
  selector: 'app-course-create-drawer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './course-create-drawer.component.html',
  styleUrl: './course-create-drawer.component.scss',
})
export class CourseCreateDrawerComponent {
  private companyApi = inject(CompanyApiService);

  visible = input(false);
  closed = output<void>();
  saved = output<void>();

  name = signal('');
  guide = signal('');
  contactPhone = signal('');
  logoPreview = signal<string | null>(null);

  canSave = computed(() => this.name().trim().length > 0);

  onClose() {
    this.reset();
    this.closed.emit();
  }

  onSave() {
    if (!this.canSave()) return;

    const body: CompanyUpsertCommand = {
      type: 'course',
      name: this.name(),
      guide: this.guide(),
      contactPhone: this.contactPhone(),
    };

    this.companyApi.createCompany(body).subscribe({
      next: () => {
        this.saved.emit();
        this.onClose();
      },
    });
  }

  onLogoSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  private reset() {
    this.name.set('');
    this.guide.set('');
    this.contactPhone.set('');
    this.logoPreview.set(null);
  }
}
