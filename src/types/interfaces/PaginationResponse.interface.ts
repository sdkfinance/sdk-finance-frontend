export interface IPaginationResponse<R> {
  status: string;
  message: string;
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  records: R[];
}
