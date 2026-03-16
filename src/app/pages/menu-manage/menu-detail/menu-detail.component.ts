import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DrawerComponent } from '../../../shared/components/drawer/drawer.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field.component';
import { DropdownSelectComponent, DropdownOption } from '../../../shared/components/dropdown-select/dropdown-select.component';

@Component({
  selector: 'app-menu-detail',
  imports: [DrawerComponent, ButtonComponent, FormFieldComponent, DropdownSelectComponent, FormsModule],
  templateUrl: './menu-detail.component.html',
  styleUrl: './menu-detail.component.scss',
})
export class MenuDetailComponent {
  readonly visible = input<boolean>(false);
  readonly visibleChange = output<boolean>();
  readonly closed = output<void>();

  readonly menuName = signal('文档库');
  readonly description = signal('成员开月，周度导向会以及填写日导向等功能');
  readonly code = signal('doc');
  readonly parentMenu = signal('权限');
  readonly icon = signal('wehanyu why-setting');
  readonly menuType = signal<'menu' | 'label' | 'button'>('menu');
  readonly position = signal('Nevigator');
  readonly route = signal('/doc');

  readonly positionOptions: DropdownOption[] = [
    { label: 'HomePage', value: 'HomePage' },
    { label: 'Header', value: 'Header' },
    { label: 'Nevigator', value: 'Nevigator' },
    { label: 'RightPanel', value: 'RightPanel' },
  ];

  readonly parentMenuOptions: DropdownOption[] = [
    {
      label: '管理后台', value: '管理后台', children: [
        {
          label: '权限', value: '权限', badge: '下级', children: [
            { label: '菜单分配', value: '菜单分配' },
            { label: '管理员分配', value: '管理员分配' },
            { label: '菜单权限查询', value: '菜单权限查询' },
            { label: '成员菜单权限变更', value: '成员菜单权限变更' },
            { label: '成员管理权限', value: '成员管理权限' },
          ]
        },
      ]
    },
    { label: 'T度导向', value: 'T度导向' },
    { label: '协同共创会', value: '协同共创会' },
  ];

  close(): void {
    this.visibleChange.emit(false);
    this.closed.emit();
  }

  save(): void {
    this.close();
  }
}
