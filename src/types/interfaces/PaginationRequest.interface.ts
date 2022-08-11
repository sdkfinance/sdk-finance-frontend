export interface IPaginationRequestOptions<F, S> {
  pageSize?: string | number;
  pageNumber?: string | number;
  all?: boolean;
  filter?: F;
  records?: object[];
  sort?: S;
}
