export type PageState = 'loading' | 'empty' | 'normal' | 'error' | 'modal';

export interface PageStateConfig<T = unknown> {
  state: PageState;
  data: T[];
  error?: string;
  modalVisible?: boolean;
}
