import { Component, inject } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-icon-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './icon-sidebar.component.html',
  styleUrl: './icon-sidebar.component.scss',
  host: {
    '[class.admin]': 'isAdmin()',
    '[class.user]': '!isAdmin()',
  },
})
export class IconSidebarComponent {
  private menuService = inject(MenuService);
  private auth = inject(AuthService);

  navItems = this.menuService.navItems;
  activeNavId = this.menuService.activeNavId;
  isAdmin = this.auth.isAdmin;

  onNavClick(id: string) {
    this.menuService.setActiveNav(id);
  }
}
