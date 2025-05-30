export class WebResponse<T> {
  data?: T;
  errors?: string;
  paging?: Paging;
}

export interface Paging {
  current_page: number;
  total_page: number;
  total_item: number;
}
