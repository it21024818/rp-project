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
}
