import { Component, inject, OnInit } from '@angular/core';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [AppLayoutComponent],
  template: '<app-layout />',
})
export class App implements OnInit {
  private readonly themeService = inject(ThemeService);

  ngOnInit(): void {
    // TODO: 登录后从账号信息获取主题，如 accountInfo.themeKey
    // 这里用默认主题，实际使用时替换为：
    // this.themeService.applyTheme(accountInfo.themeKey);
    this.themeService.applyTheme('blue');
  }
}
