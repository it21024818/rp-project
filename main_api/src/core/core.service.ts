import { Injectable, Logger } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { isArray, isString, isUndefined } from 'lodash';
import { FilterQuery, SortOrder } from 'mongoose';
import { Model } from 'mongoose';
import { PageMetadata } from 'src/common/dtos/page-metadata.dto';
import { CriteriaOperator, CritieriaOperator, PageRequest } from 'src/common/dtos/page-request.dto';
import { Page } from 'src/common/dtos/page.dto';
import { TimeBasedAnalytics } from 'src/common/dtos/time-based-analytics.dto';
import ErrorMessage from 'src/common/enums/error-message.enum';
import { Frequency } from 'src/common/enums/frequency.enum';
import { Audit } from 'src/core/audit.schema';

@Injectable()
export class CoreService {
  private readonly logger = new Logger(CoreService.name);

  public async getOptimizedTimeBasedAnalytics<T extends string, V extends Audit>({
    model,
    options,
    fields,
    filters,
  }: {
    model: Model<V>;
    options: { startDate: Date; endDate: Date; frequency: Frequency };
    fields: Record<string, { path: string; value: any }>;
    filters?: Record<string, string | undefined>;
  }): Promise<TimeBasedAnalytics<T>> {
    const { startDate, endDate, frequency } = options;

    // Sanitize filters by removing undefined values
    const sanitizedFilters = Object.entries(filters ?? {}).reduce<Record<string, any>>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    const fieldAggregations = Object.entries(fields).reduce((acc, [fieldKey, { path, value }]) => {
      acc[fieldKey] = {
        $sum: {
          $cond: [{ $eq: [`$${path}`, value] }, 1, 0],
        },
      };
      return acc;
    }, {} as Record<string, any>);

    // Determine date format based on frequency
    let dateFormat: string;
    switch (frequency) {
      case 'DAILY':
        dateFormat = '%Y-%m-%d';
        break;
      case 'WEEKLY':
        dateFormat = '%Y-%U';
        break;
      case 'MONTHLY':
        dateFormat = '%Y-%m';
        break;
      case 'YEARLY':
        dateFormat = '%Y';
        break;
      default:
        dateFormat = '%Y-%m-%d'; // Default to daily if frequency is unknown
    }

    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
          ...sanitizedFilters,
        },
      },
      {
        $addFields: {
          bin: {
            $dateToString: {
              format: dateFormat,
              date: '$createdAt',
            },
          },
        },
      },
      {
        $group: {
          _id: '$bin',
          count: { $sum: 1 },
          ...fieldAggregations, // Aggregate fields by counting matches
        },
      },
      {
        $group: {
          _id: null,
          bins: {
            $push: {
              startDate: '$_id',
              endDate: '$_id',
              ...Object.fromEntries(Object.keys(fields).map(fieldKey => [fieldKey, `$${fieldKey}`])),
            },
          },
          total: { $sum: '$count' },
        },
      },
      {
        $addFields: {
          sum: {
            total: '$total',
            ...Object.fromEntries(Object.keys(fields).map(fieldKey => [fieldKey, { $sum: `$bins.${fieldKey}` }])),
          },
        },
      },
      {
        $project: {
          _id: 0,
          bins: 1,
          sum: 1,
        },
      },
    ];

    const result = (await model.aggregate(pipeline)).at(0);
    return result as TimeBasedAnalytics<T>;
  }

  async getDocumentPage<T>(model: Model<T>, { pageNum = 1, pageSize = 10, filter, sort }: PageRequest) {
    try {
      const [content, totalDocuments] = await Promise.all([
        model
          .find(this.buildQueryFromFilter(filter))
          .sort(this.buildSort(sort))
          .skip((pageNum - 1) * pageSize)
          .limit(pageSize),
        model.count(),
      ]);
      const jsonContent = content.map(doc => doc.toJSON());
      const page = this.buildPage(jsonContent, {
        pageNum,
        pageSize,
        totalDocuments,
        sort,
      } as PageMetadata);
      return page;
    } catch (error) {
      this.logger.error('Could not get document page due to the following error: ', error);
      throw error;
    }
  }

  buildSort = (sort: PageRequest['sort']) => {
    const sortArr: [string, SortOrder][] = [Object.values(sort ?? {}) as [string, SortOrder]];
    return sortArr;
  };

  buildQueryFromFilter = (filter: PageRequest['filter']): FilterQuery<any> => {
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

  buildPage<T>(content: T[], metadata: PageMetadata): Page<T> {
    const totalPages = Math.ceil(metadata.totalDocuments / metadata.pageSize);
    const isFirst = metadata.pageNum <= 1;
    const isLast = metadata.pageNum === totalPages;

    return {
      content,
      metadata: {
        ...metadata,
        isFirst,
        isLast,
        totalPages,
      },
    };
  }

  private buildQuery = (field: string, operator: CritieriaOperator, value: any) => {
    switch (operator) {
      case CriteriaOperator.EQUALS:
        return this.buildEqualsQuery(field, value);
      case CriteriaOperator.GREATER_THAN:
        return this.buildGreaterThanQuery(field, value);
      case CriteriaOperator.LESS_THAN:
        return this.buildLessThanQuery(field, value);
      case CriteriaOperator.NOT_EQUAL:
        return this.buildNotEqualsQuery(field, value);
      case CriteriaOperator.IN:
        return this.buildInQuery(field, value);
      case CriteriaOperator.NOT_IN:
        return this.buildNotInQuery(field, value);
      case CriteriaOperator.LIKE:
        return this.buildLikeQuery(field, value);
      default:
        throw new BadRequestException(ErrorMessage.INVALID_OPERATOR, {
          description: `Operator '${operator}' is not allowed. Valid operators are ${Object.values(CriteriaOperator)}`,
        });
    }
  };

  private buildInQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    if (!isArray(value)) {
      value = [value];
    }

    return { [field]: { $in: value } };
  };

  private buildNotInQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    if (!isArray(value)) {
      value = [value];
    }

    return { [field]: { $nin: value } };
  };

  private buildEqualsQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    return { [field]: { $eq: value } };
  };

  private buildNotEqualsQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    return { [field]: { $ne: value } };
  };

  private buildGreaterThanQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    return { [field]: { $gt: value } };
  };

  private buildLessThanQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    return { [field]: { $lt: value } };
  };

  private buildLikeQuery = (field: string, value: any) => {
    if (isUndefined(value)) {
      return null;
    }

    if (!isString(value)) {
      value = String(value);
    }

    return { [field]: { $regex: value } };
  };
}
