// Tab
export interface Tab {
  key: string;
  label: string;
  closable: boolean;
}

// Navigation
export interface NavItem {
  key: string;
  icon: string;
  label: string;
}

export interface MenuGroupItem {
  key: string;
  label: string;
}

export interface MenuGroup {
  title: string;
  items: MenuGroupItem[];
}

// Table
export interface ColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface TreeNode {
  key: string;
  data: Record<string, any>;
  children?: TreeNode[];
  expanded?: boolean;
}

// Button
export type ButtonVariant = 'primary' | 'danger' | 'outline-danger' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md';

// Badge
export type BadgeVariant = 'primary' | 'success' | 'danger' | 'warning' | 'default';

// Action bar
export interface ActionButton {
  label: string;
  variant: ButtonVariant;
  icon?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

// Dialog
export type PasswordDialogStep = 'input' | 'input-countdown' | 'error' | 'forgot' | 'forgot-error' | 'confirm' | 'modify-binding' | 'success';

// Company Tree (for menu-assign page)
export interface CompanyTreeNode {
  key: string;
  label: string;
  icon?: string;
  iconColor?: string;
  iconText?: string;
  childCount?: number;
  children?: CompanyTreeNode[];
}

// Filter bar
export interface FilterItem {
  key: string;
  label: string;
  value: string;
  options?: FilterOption[];
  type?: 'select' | 'input' | 'date-range';
}

// Stats card
export interface StatsCard {
  label: string;
  value: string | number;
  clickable?: boolean;
}

// Person tree
export interface PersonTreeNode extends CompanyTreeNode {
  avatar?: string;
  children?: PersonTreeNode[];
}

// Role list
export interface RoleGroup {
  title: string;
  expanded?: boolean;
  roles: RoleItem[];
}

export interface RoleItem {
  key: string;
  label: string;
  selected?: boolean;
  badge?: string;
}
