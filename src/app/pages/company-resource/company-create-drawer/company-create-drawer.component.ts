import { Component, input, output, signal, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CompanyApiService } from '../../../api';
import { type CompanyUpsertCommand, type CompanyMatchVo } from '../../../api/types/company.type';

@Component({
  selector: 'app-company-create-drawer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './company-create-drawer.component.html',
  styleUrl: './company-create-drawer.component.scss',
})
export class CompanyCreateDrawerComponent {
  private companyApi = inject(CompanyApiService);

  visible = input(false);
  closed = output<void>();
  saved = output<void>();

  name = signal('');
  creditNo = signal('');
  aliasName = signal('');
  guide = signal('');
  contactPhone = signal('');
  logoPreview = signal<string | null>(null);

  /** 搜索建议 */
  suggestions = signal<CompanyMatchVo[]>([]);
  showSuggestions = signal(false);
  private searchInput$ = new Subject<string>();

  canSave = computed(() => this.name().trim().length > 0);

  constructor() {
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(keyword => {
        if (!keyword.trim()) return of([]);
        return this.companyApi.searchCompanies({ keyword, pageNum: 1 });
      }),
      takeUntilDestroyed(),
    ).subscribe(list => {
      this.suggestions.set(list);
      this.showSuggestions.set(list.length > 0);
    });
  }

  onNameInput(value: string) {
    this.name.set(value);
    this.searchInput$.next(value);
  }

  selectSuggestion(item: CompanyMatchVo) {
    this.name.set(item.companyName ?? '');
    if (item.creditCode) {
      this.creditNo.set(item.creditCode);
    }
    this.showSuggestions.set(false);
  }

  hideSuggestions() {
    setTimeout(() => this.showSuggestions.set(false), 200);
  }

  onClose() {
    this.reset();
    this.closed.emit();
  }

  onSave() {
    if (!this.canSave()) return;

    const body: CompanyUpsertCommand = {
      type:'company',
      name: this.name(),
      creditNo: this.creditNo(),
      aliasName: this.aliasName(),
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
    this.creditNo.set('');
    this.aliasName.set('');
    this.guide.set('');
    this.contactPhone.set('');
    this.logoPreview.set(null);
    this.searchInput$.next('');
    this.suggestions.set([]);
    this.showSuggestions.set(false);
  }
}
