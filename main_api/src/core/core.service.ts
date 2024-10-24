import { Injectable, Logger } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { isArray, isEmpty, isString, isUndefined, set } from 'lodash';
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

  public async getOptimizedTimeBasedAnalytics<T extends string, V extends Audit>(params: {
    model: Model<V>;
    options: { startDate: Date; endDate: Date; frequency: Frequency };
    fields: Record<string, { path: string; value: any }>;
    filters?: Record<string, string | undefined>;
  }): Promise<TimeBasedAnalytics<T>> {
    this.logger.log(`Getting optimized time-based analytics based on params ${JSON.stringify(params)}`);
    const { model, options, fields, filters } = params;
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
    let result: TimeBasedAnalytics<T> | undefined = (await model.aggregate(pipeline)).at(0);
    if (isEmpty(result)) {
      this.logger.warn('No analytics data found for the given parameters. Building empty result.');
      result = {
        sum: {
          total: 0,
          ...Object.fromEntries(Object.keys(fields).map(fieldKey => [fieldKey, 0])),
        },
        bins: [],
      } as TimeBasedAnalytics<T>;
    }

    // Format dates correctly
    result.bins.forEach(bin => {
      bin.endDate = this.convertToDate(frequency, bin.endDate) as any;
      bin.startDate = this.convertToDate(frequency, bin.startDate) as any;
    });

    // Find missing bins and add them to the result
    const existingBins = result.bins.map(bin => bin.startDate);
    const missingBins = this.findMissingBins(startDate.toISOString(), endDate.toISOString(), frequency, existingBins);
    missingBins.forEach(date => {
      result.bins.push({
        startDate: date,
        endDate: date,
        ...Object.fromEntries(Object.keys(fields).map(fieldKey => [fieldKey, 0])),
      } as any);
    });

    // Sort the bins according to dates
    result.bins.sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA.getTime() - dateB.getTime();
    });

    this.logger.log('Successfully retrieved optimized time-based analytics');
    return result as TimeBasedAnalytics<T>;
  }

  private findMissingBins(startDate: string, endDate: string, frequency: Frequency, existingBins: string[]): string[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const existingSet = new Set(existingBins); // Using a Set for efficient lookup
    const missingBins = [];

    const formatDate = (date: Date) => date.toISOString().split('T')[0]; // Formats date to 'YYYY-MM-DD'

    // Align start date to the appropriate boundary
    const alignedStart = new Date(start);

    switch (frequency) {
      case 'DAILY':
        // No alignment needed for daily frequency
        break;

      case 'WEEKLY':
        // Align to the start of the week (Monday)
        const dayOfWeek = alignedStart.getUTCDay(); // 0 is Sunday, 1 is Monday, etc.
        const daysToMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // Calculate days to the next Monday
        alignedStart.setUTCDate(alignedStart.getUTCDate() + daysToMonday - 7); // Align to the previous Monday
        break;

      case 'MONTHLY':
        // Align to the first day of the current month
        alignedStart.setUTCDate(1);
        break;

      case 'YEARLY':
        // Align to the first day of the current year
        alignedStart.setUTCMonth(0); // January
        alignedStart.setUTCDate(1);
        break;
    }

    let current = new Date(alignedStart);

    while (current <= end) {
      const formattedDate = formatDate(current);

      // Check if the current bin is missing
      if (!existingSet.has(formattedDate)) {
        missingBins.push(formattedDate);
      }

      // Increment based on the frequency
      switch (frequency) {
        case 'DAILY':
          current.setUTCDate(current.getUTCDate() + 1); // Increment by one day
          break;
        case 'WEEKLY':
          current.setUTCDate(current.getUTCDate() + 7); // Increment by one week
          break;
        case 'MONTHLY':
          current.setUTCMonth(current.getUTCMonth() + 1); // Increment by one month
          break;
        case 'YEARLY':
          current.setUTCFullYear(current.getUTCFullYear() + 1); // Increment by one year
          break;
      }
    }

    return missingBins;
  }

  private convertToDate(frequency: Frequency, dateString: string) {
    const [year, rest] = dateString.split('-');
    let date;

    switch (frequency) {
      case 'DAILY':
        // Format is already '%Y-%m-%d'
        date = new Date(dateString);
        break;

      case 'WEEKLY':
        // Format is '%Y-%U', where %U is the week number of the year
        const weekNumber = parseInt(rest, 10);
        date = new Date(year);
        date.setMonth(0); // January
        date.setDate(1 + (weekNumber - 1) * 7); // Set to the first day of the given week
        break;

      case 'MONTHLY':
        // Format is '%Y-%m'
        const month = parseInt(rest, 10) - 1; // Months in JS are zero-based
        date = new Date(year);
        date.setMonth(month);
        date.setDate(0);
        break;

      case 'YEARLY':
        // Format is '%Y'
        date = new Date(year); // January 1st of that year
        break;

      default:
        // Default to daily if frequency is unknown
        date = new Date(dateString);
    }

    // Convert back to the format '%Y-%m-%d'
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
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
    const sortArr: [string, SortOrder][] = [[sort?.field, sort?.direction]] as [string, SortOrder][];
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
