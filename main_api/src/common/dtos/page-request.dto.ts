import { IsEnum, IsIn, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { SortOrder } from 'mongoose';

export const CriteriaOperator = {
  EQUALS: 'EQUALS',
  GREATER_THAN: 'GREATER_THAN',
  LESS_THAN: 'LESS_THAN',
  NOT_EQUAL: 'NOT_EQUAL',
  IN: 'IN',
  NOT_IN: 'NOT_IN',
  LIKE: 'LIKE',
} as const;

export type CritieriaOperator = keyof typeof CriteriaOperator;

const sortDirections = [-1, 1, 'asc', 'ascending', 'desc', 'descending'];

export class SortItem {
  @IsString()
  @IsNotEmpty()
  field: string;
  @IsNotEmpty()
  @IsIn(sortDirections)
  direction: SortOrder;
}

export class FilterItem {
  @IsNotEmpty()
  @IsEnum(CriteriaOperator)
  operator: CritieriaOperator;
  value: any;
}

export class PageRequest {
  @IsOptional()
  @IsNumber()
  pageNum: number;

  @IsOptional()
  @IsNumber()
  pageSize: number;

  @IsOptional()
  @IsObject()
  sort?: SortItem;

  @IsOptional()
  @IsObject()
  filter?: { [field: string]: FilterItem };
}
