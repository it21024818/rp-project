import {
  CriteriaOperator,
  CritieriaOperator,
  PageRequest,
} from '../dtos/page-request.dto';
import { BadRequestException } from '@nestjs/common';
import ErrorMessage from '../enums/error-message.enum';
import { isArray, isString, isUndefined } from 'lodash';
import { FilterQuery, SortOrder } from 'mongoose';

export class QueryUtil {
  static buildSort = (sort: PageRequest['sort']) => {
    const sortArr: [string, SortOrder][] = Object.entries(sort ?? {}).map(
      ([key, value]) => [key, value as SortOrder],
    );
    return sortArr;
  };

  static buildQueryFromFilter = (
    filter: PageRequest['filter'],
  ): FilterQuery<any> => {
    return Object.entries(filter ?? {}).reduce((obj, [field, opVal]) => {
      if (!opVal?.operator || !opVal?.value)
        throw new BadRequestException(
          ErrorMessage.INVALID_OPERATOR_OR_VALUE_FOR_FIELD,
          `Field '${field}' did not receive a correct operator and/or value. Allowed operators are ${Object.values(
            CriteriaOperator,
          )}`,
        );
      return { ...obj, ...this.buildQuery(field, opVal.operator, opVal.value) };
    }, {});
  };

  private static buildQuery = (
    field: string,
    operator: CritieriaOperator,
    value: any,
  ) => {
    switch (operator) {
      case 'EQUALS':
        return this.buildEqualsQuery(field, value);
      case 'GREATER_THAN':
        return this.buildGreaterThanQuery(field, value);
      case 'LESS_THAN':
        return this.buildLessThanQuery(field, value);
      case 'NOT_EQUAL':
        return this.buildNotEqualsQuery(field, value);
      case 'IN':
        return this.buildInQuery(field, value);
      case 'NOT_IN':
        return this.buildNotInQuery(field, value);
      case 'LIKE':
        return this.buildLikeQuery(field, value);
    }
  };

  private static buildInQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    if (!isArray(value)) {
      value = [value];
    }

    return { [field]: { $in: value } };
  };

  private static buildNotInQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    if (!isArray(value)) {
      value = [value];
    }

    return { [field]: { $nin: value } };
  };

  private static buildEqualsQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    return { [field]: { $eq: value } };
  };

  private static buildNotEqualsQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    return { [field]: { $ne: value } };
  };

  private static buildGreaterThanQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    return { [field]: { $gt: value } };
  };

  private static buildLessThanQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    return { [field]: { $lt: value } };
  };

  private static buildLikeQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    if (!isString(value)) {
      value = String(value);
    }

    return { [field]: { $regex: value } };
  };
}
