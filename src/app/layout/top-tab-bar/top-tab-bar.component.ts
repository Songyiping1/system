import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';
import { ChangePasswordModalComponent } from '../../shared/components/change-password-modal/change-password-modal.component';
import { ChangeBindingModalComponent } from '../../shared/components/change-binding-modal/change-binding-modal.component';

interface Tab {
  id: string;
  label: string;
  closable: boolean;
}

@Component({
  selector: 'app-top-tab-bar',
  standalone: true,
  imports: [ChangePasswordModalComponent, ChangeBindingModalComponent],
  templateUrl: './top-tab-bar.component.html',
  styleUrl: './top-tab-bar.component.scss',
})
export class TopTabBarComponent {
  private auth = inject(AuthService);
  private menuService = inject(MenuService);
  private elRef = inject(ElementRef);

  user = this.auth.currentUser;
  isAdmin = this.auth.isAdmin;
  activeNavLabel = this.menuService.activeNavId;
  showUserMenu = signal(false);
  showChangePwd = signal(false);
  showChangeBinding = signal(false);

  tabs = signal<Tab[]>([
    { id: 'home', label: '首页', closable: true },
  ]);

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
  }

  onChangePassword() {
    this.showUserMenu.set(false);
    this.showChangePwd.set(true);
  }

  onChangeBinding() {
    this.showUserMenu.set(false);
    this.showChangeBinding.set(true);
  }

  onSwitchAccount() {
    this.showUserMenu.set(false);
    this.auth.logout();
  }

  onLogout() {
    this.showUserMenu.set(false);
    this.auth.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showUserMenu() && !this.elRef.nativeElement.contains(event.target)) {
      this.showUserMenu.set(false);
    }
  }
}
