import { Document } from 'mongoose';
import { ToQueryMongodb } from 'src/decorator/to-query-mongodb';

import { PaginationInterface } from '../interface/pagination.interface';

export class PaginateResponse<T extends Document>
  implements PaginationInterface
{
  total: number;
  offset: number;
  limit: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  items: T[];
}

export class PaginationRequest implements PaginationInterface {
  @ToQueryMongodb() search?: any;
  page?: number;
  offset?: number;
  limit?: number;
  sortBy?: string;
}
