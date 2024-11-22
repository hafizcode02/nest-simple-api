export class BaseResponseDto<T> {
  message?: string;
  data?: T;
  error?: string;
  paging?: Paging;
}

export class Paging {
  size: number;
  page: number;
  current_page: number;
}
