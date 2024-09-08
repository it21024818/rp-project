import { SortOrder } from 'mongoose';

export type PageMetadata = {
  isFirst: boolean;
  isLast: boolean;
  totalDocuments: number;
  totalPages: number;
  pageSize: number;
  pageNum: number;
  sort?: {
    field: string;
    direction: SortOrder;
  };
};
