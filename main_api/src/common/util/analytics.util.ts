import dayjs from 'dayjs';
import _ from 'lodash';
import { Model } from 'mongoose';
import { TimeBasedAnalytics } from '../dtos/time-based-analytics.dto';
import { Frequency, FrequencyUtil } from '../enums/frequency.enum';
import { Audit } from '../schema/audit.schema';

export class AnalyticsUtils {
  public static async getTimeBasedAnalytics<T extends string, V extends Audit>({
    model,
    options,
    fields,
    filters,
  }: {
    model: Model<V>;
    options: { startDate: Date; endDate: Date; frequency: Frequency };
    fields: Record<T, (item: V) => boolean | undefined>;
    filters?: Record<string, string | undefined>;
  }): Promise<TimeBasedAnalytics<T>> {
    let bins: TimeBasedAnalytics<string>['bins'] = [];
    const { startDate, endDate, frequency } = options;
    const sanitizedFilters: Record<string, any> = {};
    for (const key in filters) {
      if (filters[key]) {
        sanitizedFilters[key] = filters[key];
      }
    }
    console.log({ createdAt: { $gte: startDate, $lt: endDate }, ...sanitizedFilters });
    const items = await model.find({ createdAt: { $gte: startDate, $lt: endDate }, ...sanitizedFilters });
    let current = dayjs(startDate);
    const end = dayjs(endDate);
    const stop = 9999;
    while (current.isBefore(end) && bins.length < stop) {
      const next = current.add(1, FrequencyUtil.getDayJsUnit(frequency));
      const currentBin: (typeof bins)[number] = { startDate: current.toDate(), endDate: next.toDate() } as any;
      for (const field in fields) {
        const predicate = fields[field];
        const count = items
          .filter(item => dayjs(item.createdAt).isBefore(next))
          .filter(item => dayjs(item.createdAt).isAfter(current))
          .filter(predicate).length;
        currentBin[field] = count;
      }

      bins = [...bins, currentBin];
      current = next;
    }
    const sum: TimeBasedAnalytics<string>['sum'] = {
      total: 0,
    };
    for (const field in fields) {
      sum[field] = _.sum(bins.map(i => i[field]));
    }
    sum.total = _.sum(Object.values(sum));
    return { sum, bins } as TimeBasedAnalytics<T>;
  }

  public static async getOptimizedTimeBasedAnalytics<T extends string, V extends Audit>({
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
}
