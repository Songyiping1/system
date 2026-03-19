import { Component, inject, computed, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IconSidebarComponent } from './icon-sidebar/icon-sidebar.component';
import { SubSidebarComponent } from './sub-sidebar/sub-sidebar.component';
import { TopTabBarComponent } from './top-tab-bar/top-tab-bar.component';
import { MenuService } from '../services/menu.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, IconSidebarComponent, SubSidebarComponent, TopTabBarComponent],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  host: {
    '[class.role-admin]': 'isAdmin()',
    '[class.role-user]': '!isAdmin()',
  },
})
export class AppLayoutComponent implements OnInit {
  private menuService = inject(MenuService);
  private auth = inject(AuthService);

  isAdmin = this.auth.isAdmin;

  ngOnInit() {
    this.menuService.initForRole();
  }
}
