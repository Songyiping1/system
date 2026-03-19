import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-sub-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sub-sidebar.component.html',
  styleUrl: './sub-sidebar.component.scss',
})
export class SubSidebarComponent {
  private menuService = inject(MenuService);
  private router = inject(Router);

  groupedMenus = this.menuService.groupedSubMenus;
  activeSubMenuId = this.menuService.activeSubMenuId;

  onMenuClick(item: { id: string; route: string }) {
    this.menuService.setActiveSubMenu(item.id);
    this.router.navigate([item.route]);
  }
}
