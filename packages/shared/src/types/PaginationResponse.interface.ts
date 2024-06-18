export interface IPaginationResponse<R> {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  records: R[];
}
