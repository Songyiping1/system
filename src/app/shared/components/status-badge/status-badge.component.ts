import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  status = input.required<string>();

  cssClass = computed(() => {
    const s = this.status();
    if (['正常', '审批通过'].includes(s)) return 'success';
    if (['拒绝', '已停用', '拒绝关联', '已注销'].includes(s)) return 'danger';
    if (['待处理', '审批中'].includes(s)) return 'warning';
    return 'default';
  });
}
