import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';

interface Tab {
  id: string;
  label: string;
  closable: boolean;
}

@Component({
  selector: 'app-top-tab-bar',
  standalone: true,
  imports: [],
  templateUrl: './top-tab-bar.component.html',
  styleUrl: './top-tab-bar.component.scss',
  host: {
    '[class.admin]': 'isAdmin()',
    '[class.user]': '!isAdmin()',
  },
})
export class TopTabBarComponent {
  private auth = inject(AuthService);
  private menuService = inject(MenuService);

  user = this.auth.currentUser;
  isAdmin = this.auth.isAdmin;
  activeNavLabel = this.menuService.activeNavId;

  tabs = signal<Tab[]>([
    { id: 'home', label: '首页', closable: true },
  ]);

  onLogout() {
    this.auth.logout();
  }
}
